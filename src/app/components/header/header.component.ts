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

  private routeSub: Subscription = new Subscription();
  private channelSubscription!: Subscription;
  private chatSubscription!: Subscription;
  private directMessageSubscription!: Subscription;
  subscriptions: Subscription[] = [
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
    public threadService: ThreadService
  ) { }

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
    });

    this.userService.getMainUser(this.currentUserId);

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
            this.messageService
              .getAllMessages(channel.uid, 'channels')
              .subscribe({
                next: (messages) => {
                  // Check for duplicates before pushing
                  let copyMessages = JSON.parse(
                    JSON.stringify(messages),
                  ) as any[];
                  // this.allChannelMessages = [];

                  copyMessages.forEach((message) => {
                    const exists = this.allChannelMessages.some(
                      (existingMessage) =>
                        existingMessage.uid === message.uid ||
                        existingMessage.sentAt === message.sentAt || // Use a reliable unique field
                        message.uid == '',
                    );

                    if (!exists) {
                      // Only push new message if it does not already exist
                      this.allChannelMessages.push(message);
                    }
                  });

                  // Only push new message if it does not already exist

                  // console.log('allChannelMessages', this.allChannelMessages);
                },
                error: (error) => {
                  console.error('Error fetching messages:', error);
                },
              });
          }
        });
      });

    this.chatSubscription = this.directChatService.chats$
      .pipe(
        map((chats) =>
          chats.filter((chat) => chat.usersIds.includes(this.currentUserId)),
        ),
      )
      .subscribe((filteredChats) => {
        this.allChats = [];
        // this.allDirectMessages = [];
        filteredChats.forEach(async (chat) => {
          if (chat && chat.uid) {
            this.allChats.push(chat);
            this.messageService.getAllMessages(chat.uid, 'chats').subscribe({
              next: (messages) => {
                let copyMessages = JSON.parse(
                  JSON.stringify(messages),
                ) as any[];
                copyMessages.forEach((message) => {
                  const exists = this.allDirectMessages.some(
                    (existingMessage) =>
                      existingMessage.uid === message.uid ||
                      existingMessage.sentAt === message.sentAt ||
                      message.uid == '',
                    // Use a reliable unique field
                  );

                  if (!exists) {
                    this.allDirectMessages.push(message);
                  }
                });

                // console.log('allDirectMessages', this.allDirectMessages);
              },
              error: (error) => {
                console.error('Error fetching messages:', error);
              },
            });
          }
        });
      });

    document.addEventListener('click', (event) => {
      const resultBox = document.getElementById('result-box-header');
      if (event.target != resultBox) {
        this.contents = [];
      }
    });
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
    this.userService.updateUser(this.userService.mainUser, this.userService.mainUser.uid);
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
        result = this.allChannels.filter((channel) => {
          const keyword = input.slice(1).toLowerCase(); // Remove the '#' from input for comparison
          return channel.name?.toLowerCase().includes(keyword);
        });
      } else if (input.startsWith('@')) {
        result = this.userService.users.filter((user) => {
          const keyword = input.slice(1).toLowerCase(); // Remove the '@' from input for comparison
          return user.name?.toLowerCase().includes(keyword);
        });
      } else {
        const keyword = input.toLowerCase();

        this.allMessages = [
          ...this.allChannelMessages,
          ...this.allDirectMessages,
        ];
        result = this.allMessages
          .flat() // Flatten the array
          .filter(
            (message: any) => message.text && message.text.includes(keyword),
          );
      }
    }
    this.contents = result;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe(),
    );
  }
}
