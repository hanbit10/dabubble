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
import { WillkommenComponent } from '../../components/willkommen/willkommen.component';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';

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
    ProfileEditPictureComponent,
    WillkommenComponent,
    SearchEngineComponent,
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
    public directChatService: DirectChatService,
  ) {}

  /**
   * Handles the layout of the Mainpage when the window is resized.
   * It calls methods to set the visibility of the main-menu, main-chat-container and thread-container
   * for screens below 1050px and mobile-sized screens.
   *
   * @param {Event} event - The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.utilityService.innerWidth = event.target.innerWidth;
    this.setMobile();
    this.handleMainChat1050();
    this.handleMainChatMobile();
  }

  ngOnInit(): void {
    this.utilityService.innerWidth = window.innerWidth;
    this.setMobile();
    this.handleMainChat1050();
    this.handleMainChatMobile();
  }

  /**
   * Sets the mobile view state based on the screen width.
   */
  setMobile() {
    if (this.utilityService.innerWidth <= 700) {
      this.utilityService.mobile = true;
    } else {
      this.utilityService.mobile = false;
    }
  }

  /**
   * Handles the visibility of the 'main-chat-container' when the screen width is below 1050px
   * and the thread of a message is open.
   */
  handleMainChat1050() {
    if (this.utilityService.innerWidth < 1050) {
      if (this.threadService.threadIsOpen) {
        this.utilityService.closeComponent('main-chat-container');
      } else {
        this.utilityService.openComponent('main-chat-container');
      }
    } else {
      this.utilityService.openComponent('main-chat-container');
    }
  }

  /**
   * Adjusts the layout of the mainpage based on the mobile view state.
   */
  handleMainChatMobile() {
    if (this.utilityService.mobile) {
      this.handleChannelMobile();
      this.handleThreadMobile();
    } else {
      this.utilityService.menuIsOpen = true;
    }
  }

  /**
   * Handles the mobile-specific layout for channels.
   */
  handleChannelMobile() {
    if (this.channelService.channelIsOpen) {
      this.utilityService.openComponent('main-chat-container');
      this.utilityService.menuIsOpen = false;
    } else {
      this.utilityService.closeComponent('main-chat-container');
    }
  }

  /**
   * Handles the mobile-specific layout for threads.
   */
  handleThreadMobile() {
    if (this.threadService.threadIsOpen) {
      this.utilityService.openComponent('thread-container');
      this.utilityService.closeComponent('main-chat-container');
      this.utilityService.menuIsOpen = false;
    } else {
      this.utilityService.closeComponent('thread-container');
    }
  }

  /**
   * Opens and closes the main menu.
   */
  toggleMenu() {
    if (this.utilityService.menuIsOpen) {
      this.utilityService.menuIsOpen = false;
    } else {
      this.utilityService.menuIsOpen = true;
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

  openNewMessageMobile() {
    this.utilityService.menuIsOpen = false;
    this.channelService.channelIsOpen = true;
    this.utilityService.openComponent('main-chat-container');
  }
}
