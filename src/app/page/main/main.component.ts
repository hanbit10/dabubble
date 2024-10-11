import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ChannelNavComponent } from '../../components/channel-nav/channel-nav.component';
import { ChannelCreateComponent } from '../../components/channel-create/channel-create.component';
import { DirectNavComponent } from '../../components/direct-nav/direct-nav.component';
import { ProfileService } from '../../services/profile.service';
import { ProfileUserComponent } from '../../components/profile-user/profile-user.component';
import { ThreadComponent } from '../../components/thread/thread.component';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { ProfileEditPictureComponent } from '../../components/profile-edit-picture/profile-edit-picture.component';
import { UtilityService } from '../../services/utility.service';
import { UserService } from '../../services/user.service';
import { Channel } from '../../models/channels';
import { DirectChat } from '../../models/direct-chat';
import { Subscription, map } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { DirectChatService } from '../../services/direct-chat.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    HeaderComponent,
    ChannelNavComponent,
    ChannelCreateComponent,
    DirectNavComponent,
    ProfileUserComponent,
    ThreadComponent,
    ProfileEditPictureComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  menuOpen = true;
  contents: any[] = [];

  currentUserId: string = '';
  allChannels: Channel[] = [];
  allChats: DirectChat[] = [];
  allDirectMessages: any[] = [];
  allChannelMessages: any[] = [];
  allMessages: any[] = [];

  private channelSubscription!: Subscription;
  private chatSubscription!: Subscription;
  private directMessageSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.channelSubscription,
    this.chatSubscription,
    this.directMessageSubscription,
  ];

  constructor(
    public profileService: ProfileService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public utilityService: UtilityService,
    public userService: UserService,
    public messageService: MessageService,
    public directChatService: DirectChatService
  ) {}
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.utilityService.innerWidth = event.target.innerWidth;
    this.setMobile();
    console.log('MOBILE VERSION', this.utilityService.mobile);
    this.openCloseMainChat();
  }

  ngOnInit(): void {
    this.utilityService.innerWidth = window.innerWidth;
    this.setMobile();
    this.openCloseMainChat();

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

  openCloseMainChat(){
    let chat = document.getElementById('main-chat-container');
    
    if (this.utilityService.innerWidth < 1050) {
      if (this.threadService.threadIsOpen){
        chat?.classList.add('hidden');
      }else{
        chat?.classList.remove('hidden');
      }
    }else{
      chat?.classList.remove('hidden');
    }
  }

  setMobile(){
    if (this.utilityService.innerWidth < 700) {
      this.utilityService.mobile = true;
    }else{
      this.utilityService.mobile = false;
    }
  }

  toggleMenu() {
    if (this.menuOpen) {
      this.menuOpen = false;
    } else {
      this.menuOpen = true;
    }
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
}
