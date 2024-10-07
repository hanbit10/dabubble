import { Component, OnInit, ViewChild } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  saveToChosen(_t11: any) {
    throw new Error('Method not implemented.');
  }
  menuOpen = false;
  profileOpen = false;
  allUsers: UserProfile[] = [];
  currentUser: UserProfile = {
    email: '',
    active: false,
    name: '',
    password: '',
    uid: '',
  };
  currentUserId: string = '';
  allChannels: Channel[] = [];
  allChats: DirectChat[] = [];
  allDirectMessages: any[] = [];

  private routeSub: Subscription = new Subscription();
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private chatSubscription!: Subscription;
  @ViewChild(ProfileMainComponent) profileMainComponent!: ProfileMainComponent;
  contents: any;

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
        filteredChannels.forEach((channel) => {
          if (channel) {
            this.allChannels.push(channel);
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
        filteredChats.forEach((chat) => {
          if (chat) {
            this.allChats.push(chat);
            this.allDirectMessages.push(
              this.messageService.getAllMessages(chat.uid, 'chats'),
            );
          }
        });
      });
  }

  openMenu() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
    this.profileService.closeMainProfile();
    this.profileMainComponent.editProfile = false;
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
}
