import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Channel } from '../../models/channels';
import { DirectChat } from '../../models/direct-chat';
import { map, Subscription } from 'rxjs';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { ProfileService } from '../../services/profile.service';
import { UtilityService } from '../../services/utility.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { DirectChatService } from '../../services/direct-chat.service';
import { Message } from '../../models/message';
import { UserProfile } from '../../models/users';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-engine.component.html',
  styleUrl: './search-engine.component.scss',
})
export class SearchEngineComponent implements OnInit {
  currentUserId: string = '';
  allChannels: Channel[] = [];
  allChats: DirectChat[] = [];
  allDirectMessages: any[] = [];
  allChannelMessages: any[] = [];
  allMessages: any[] = [];
  private routeSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private chatSubscription!: Subscription;
  private directMessageSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.channelSubscription,
    this.chatSubscription,
    this.directMessageSubscription,
    this.routeSubscription,
  ];

  contents: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public profileService: ProfileService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public utilityService: UtilityService,
    public userService: UserService,
    public messageService: MessageService,
    public directChatService: DirectChatService,
  ) {}
  ngOnInit(): void {
    this.getCurrentUserId();
    this.getChannelMessages();
    this.getDirectMessages();
    this.onClick();
  }

  getChannelMessages() {
    this.channelSubscription = this.channelService.channels$
      .pipe(
        map((channels) =>
          channels.filter((channel) =>
            channel.usersIds.includes(this.currentUserId),
          ),
        ),
      )
      .subscribe((filteredChannels) => {
        this.allChannels = [];
        filteredChannels.forEach(async (channel) => {
          if (channel && channel.uid) {
            this.allChannels.push(channel);
            this.getAllMessagesByType(channel, 'channels');
          }
        });
      });
  }

  getDirectMessages() {
    this.chatSubscription = this.directChatService.chats$
      .pipe(
        map((chats) =>
          chats.filter((chat) => chat.usersIds.includes(this.currentUserId)),
        ),
      )
      .subscribe((filteredChats) => {
        this.allChats = [];
        filteredChats.forEach(async (chat) => {
          if (chat && chat.uid) {
            this.allChats.push(chat);
            this.getAllMessagesByType(chat, 'chats');
          }
        });
      });
  }

  getAllMessagesByType(model: Channel | DirectChat, type: string) {
    this.messageService.getAllMessages(model.uid, type).subscribe({
      next: (messages) => {
        this.setAllMessages(messages, type);
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      },
    });
  }

  setAllMessages(messages: Message[], type: string) {
    const copyMessages = JSON.parse(JSON.stringify(messages)) as any[];
    copyMessages.forEach((message) => {
      if (!this.messageExists(message) && type === 'chats') {
        this.allDirectMessages.push(message);
      } else if (!this.messageExists(message) && type === 'channels') {
        this.allChannelMessages.push(message);
      }
    });
  }

  messageExists(message: Message): boolean {
    return this.allDirectMessages.some(
      (existingMessage) =>
        existingMessage.uid === message.uid ||
        existingMessage.sentAt === message.sentAt ||
        message.uid === '',
    );
  }

  onClick() {
    document.addEventListener('click', (event) => {
      const resultBox = document.getElementById('result-box-header');
      if (event.target != resultBox) {
        this.contents = [];
      }
    });
  }

  getCurrentUserId() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
    });
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>document.getElementById('search-input');
    let result: any[] = [];
    let input = inputBox.value;
    if (input.length) {
      if (input.startsWith('#')) {
        result = this.filterContents(this.allChannels, input);
      } else if (input.startsWith('@')) {
        result = this.filterContents(this.userService.users, input);
      } else {
        result = this.filterMessages(input);
      }
    }
    this.contents = result;
  }

  filterContents(
    contents: Channel[] | UserProfile[],
    input: string,
  ): Channel[] | UserProfile[] {
    const keyword = input.slice(1).toLowerCase();
    return contents.filter(
      (content) => content.name?.toLowerCase().includes(keyword),
    );
  }

  filterMessages(input: string): any[] {
    const keyword = input.toLowerCase();
    this.allMessages = [...this.allChannelMessages, ...this.allDirectMessages];
    return this.allMessages
      .flat()
      .filter((message: any) => message.text && message.text.includes(keyword));
  }

  openDirectChat() {
    this.channelService.channelIsOpen = true;
    this.utilityService.openChannel();
    this.threadService.closeThread();
  }

  openChannel() {
    this.channelService.channelIsOpen = true;
    this.utilityService.openChannel();
    this.threadService.closeThread();
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
