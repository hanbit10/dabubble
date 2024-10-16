import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { ChannelService } from '../../services/channel.service';
import { DirectChatService } from '../../services/direct-chat.service';
import { UtilityService } from '../../services/utility.service';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-direct-nav',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './direct-nav.component.html',
  styleUrl: './direct-nav.component.scss',
})
export class DirectNavComponent implements OnInit, OnDestroy {
  private usersSubscription!: Subscription;
  private routeSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.routeSubscription,
  ];
  allUsers: UserProfile[] = [];
  dropdown: boolean = true;
  currentUserId: string = '';
  currentUser: UserProfile = {} as UserProfile;
  allUsersWithoutCurrentUser: UserProfile[] = [];
  currentChatId: string = '';
  constructor(
    public userService: UserService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
    public channelService: ChannelService,
    public directChatService: DirectChatService,
    public threadService: ThreadService,
  ) {}

  async ngOnInit() {
    this.getCurrentUserId();
    this.getAllUsers();
  }

  getCurrentUserId() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.currentUserId = this.utilityService.getIdByParam(paramMap, 'id');
    });
  }

  getAllUsers() {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      if (users && users.length > 0) {
        this.currentUser = users.find(
          (user) => user.uid === this.currentUserId,
        )!;
        this.allUsersWithoutCurrentUser = users.filter(
          (user) => user.uid !== this.currentUserId,
        );
        this.allUsers = [this.currentUser, ...this.allUsersWithoutCurrentUser];
      }
    });
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }

  openDirectChat() {
    this.channelService.channelIsOpen = true;
    this.utilityService.openChannel();
    this.threadService.closeThread();
  }
}
