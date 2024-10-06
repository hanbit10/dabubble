import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileMainComponent } from '../profile-main/profile-main.component';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { filter, map, Subscription } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channels';
import { DirectChatService } from '../../services/direct-chat.service';
import { DirectChat } from '../../models/direct-chat';
import { MessageService } from '../../services/message.service';

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
  menuOpen = false;
  profileOpen = false;
  currentUser: UserProfile = {
    email: '',
    active: false,
    name: '',
    password: '',
    uid: '',
  };
  currentUserId: string = '';
  allUsers: UserProfile[] = [];
  allChannels: Channel[] = [];
  allChats: DirectChat[] = [];
  allDirectMessages: any[] = [];
  allChannelMessages: any[] = [];
  allMessages: any[] = [];

  private routeSub: Subscription = new Subscription();
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private chatSubscription!: Subscription;
  private directMessageSubscription!: Subscription;
  subscriptions: Subscription[] = [
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
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
    });

    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
      let filteredUser = this.allUsers.find((user) => {
        return user.uid === this.currentUserId;
      });
      if (filteredUser) {
        this.currentUser = filteredUser;
        this.userService.mainUser = filteredUser;
      }
    });

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

                  console.log('allChannelMessages', this.allChannelMessages);
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

                console.log('allDirectMessages', this.allDirectMessages);
              },
              error: (error) => {
                console.error('Error fetching messages:', error);
              },
            });
          }
        });
      });
  }

  removeDuplicateMessages(arr: any[]) {
    const seen = new Set();
    return arr.filter((message) => {
      // Check if the 'uid' exists, if not use 'text' for comparison
      const key = message.text;
      if (seen.has(key)) {
        return false; // Duplicate found, filter it out
      }
      seen.add(key); // Add the unique key to the set
      return true; // Keep the non-duplicate message
    });
  }

  openMenu() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openProfile() {
    this.profileService.openMainProfile();
  }

  closeProfile() {
    this.profileOpen = false;
    this.profileMainComponent.editProfile = false;
    this.profileMainComponent.closeEditProfile();
  }

  logoutMainUser() {
    this.currentUser.active = false;
    this.userService.updateUser(this.currentUser, this.currentUser.uid);
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
        result = this.allUsers.filter((user) => {
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
