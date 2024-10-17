import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileMainComponent } from '../profile-main/profile-main.component';
import { UserService } from '../../services/user.service';
import { map, Subscription } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channels';
import { DirectChatService } from '../../services/direct-chat.service';
import { DirectChat } from '../../models/direct-chat';
import { MessageService } from '../../services/message.service';
import { UtilityService } from '../../services/utility.service';
import { ThreadService } from '../../services/thread.service';
import { Message } from '../../models/message';
import { UserProfile } from '../../models/users';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ProfileMainComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  saveToChosen(_t11: any) {
    throw new Error('Method not implemented.');
  }
  currentUserId: string = '';
  allChannels: Channel[] = [];
  allChats: DirectChat[] = [];
  allDirectMessages: any[] = [];
  allChannelMessages: any[] = [];
  allMessages: any[] = [];

  private routeSubscription!: Subscription;
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private chatSubscription!: Subscription;
  private directMessageSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.routeSubscription,
    this.usersSubscription,
    this.channelSubscription,
    this.chatSubscription,
    this.directMessageSubscription,
  ];
  @ViewChild(ProfileMainComponent) profileMainComponent!: ProfileMainComponent;
  contents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public channelService: ChannelService,
    public profileService: ProfileService,
    public messageService: MessageService,
    public directChatService: DirectChatService,
    public utilityService: UtilityService,
    public threadService: ThreadService,
  ) {}

  async ngOnInit() {
    this.getCurrentUserId();
    this.userService.getMainUser(this.currentUserId);
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

  openMenu() {
    this.profileService.menuIsOpen = true;
  }

  closeMenu() {
    this.profileService.menuIsOpen = false;
    this.profileService.closeMainProfile();
    this.profileMainComponent.editProfile = false;
  }

  openProfile() {
    this.profileService.openMainProfile();
  }

  logoutMainUser() {
    this.userService.mainUser.active = false;
    this.userService.updateUser(
      this.userService.mainUser,
      this.userService.mainUser.uid,
    );
  }

  closeHeaderMobile() {
    this.utilityService.menuIsOpen = true;
    this.channelService.channelIsOpen = false;
    this.threadService.threadIsOpen = false;
    this.utilityService.openComponent('main-menu');
    this.utilityService.closeComponent('main-chat-container');
    this.utilityService.closeComponent('thread-container');
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

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
