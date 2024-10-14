import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/users';
import { Channel } from '../../../models/channels';
import { ChannelService } from '../../../services/channel.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss',
})
export class ChannelHeaderComponent implements OnInit, OnDestroy {
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private routeSubscription!: Subscription;

  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.channelSubscription,
    this.routeSubscription,
  ];

  channelUsers: UserProfile[] = [];
  currentChannel: Channel = {} as Channel;
  constructor(
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  subscribeToRoute() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.getCurrentChannel(id);
      }
    });
  }

  getCurrentChannel(id: string) {
    this.channelSubscription = this.channelService.channels$
      .pipe(map((channels) => channels.find((channel) => channel.uid === id)))
      .subscribe((currChannel) => {
        if (currChannel) {
          this.currentChannel = currChannel;
          this.getChannelUsers(currChannel);
        }
      });
  }

  getChannelUsers(currChannel: Channel) {
    this.usersSubscription = this.userService.users$
      .pipe(
        map((users) =>
          users.filter((user) => currChannel.usersIds.includes(user.uid)),
        ),
      )
      .subscribe((filteredUsers) => {
        if (filteredUsers) {
          this.channelUsers = filteredUsers;
        }
      });
  }

  openComponent(elementID: string) {
    this.utilityService.openComponent(elementID);
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
