import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, Subscription, switchMap, tap } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/users';
import { Channel } from '../../../models/channels';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss',
})
export class ChannelHeaderComponent implements OnInit {
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private _items = new BehaviorSubject<Channel>({} as Channel);
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
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    // this._items.subscribe((currChannel) => {
    //   console.log(currChannel);
    //   if (currChannel) {
    //     this.usersSubscription = this.userService.users$.subscribe((users) => {
    //       console.log(users);
    //       if (users) {
    //         this.filteredUsers = users.filter((user) => {
    //           return (currChannel.usersIds || []).includes(user.uid);
    //         });
    //         console.log(this.filteredUsers);
    //       }
    //     });
    //   }
    // });

    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.channelSubscription = this.channelService.channels$
          .pipe(
            map((channels) => channels.find((channel) => channel.uid === id))
          )
          .subscribe((currChannel) => {
            if (currChannel) {
              console.log('Current Channel user IDs:', currChannel.usersIds); // Log usersIds
              this.channel = currChannel;
              this.usersSubscription = this.userService.users$
                .pipe(
                  tap((users) => console.log('All Users:', users)), // Log users to see if they contain expected IDs
                  map((users) =>
                    users.filter((user) =>
                      currChannel.usersIds.includes(user.uid)
                    )
                  )
                )
                .subscribe((filteredUsers) => {
                  if (filteredUsers) {
                    console.log('Filtered Users:', filteredUsers); // Log filtered users
                    this.filteredUsers = filteredUsers;
                  }
                  this.changeDetectorRef.detectChanges();
                });
            }
          });
      }
    });
  }

  openProfile() {
    const channelProfile = document.getElementById('channel-profile');
    channelProfile?.classList.remove('hidden');
  }

  openAddUser() {
    const addUser = document.getElementById('channel-add-user');
    addUser?.classList.remove('hidden');
  }
}
