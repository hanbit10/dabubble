import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, Subscription, switchMap, tap } from 'rxjs';
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
  private _items = new BehaviorSubject<Channel>({} as Channel);

  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.channelSubscription,
    this.routeSubscription,
  ];
  @Input() set getCurrentChannel(value: Channel) {
    this._items.next(value);
  }
  get currentChannel(): Channel {
    return this._items.getValue();
  }
  filteredUsers: UserProfile[] = [];
  channel: Channel = {} as Channel;
  constructor(
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.channelSubscription = this.channelService.channels$
          .pipe(
            map((channels) => channels.find((channel) => channel.uid === id)),
          )
          .subscribe((currChannel) => {
            if (currChannel) {
              this.channel = currChannel;
              this.usersSubscription = this.userService.users$
                .pipe(
                  map((users) =>
                    users.filter((user) =>
                      currChannel.usersIds.includes(user.uid),
                    ),
                  ),
                )
                .subscribe((filteredUsers) => {
                  if (filteredUsers) {
                    this.filteredUsers = filteredUsers;
                  }
                  this.changeDetectorRef.detectChanges();
                });
            }
          });
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
