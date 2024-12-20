import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Channel } from '../../../models/channels';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/users';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-channel-profile',
  standalone: true,
  imports: [],
  templateUrl: './channel-profile.component.html',
  styleUrl: './channel-profile.component.scss',
})
export class ChannelProfileComponent implements OnInit, OnDestroy {
  private usersSubscription!: Subscription;
  private _items = new BehaviorSubject<Channel>({} as Channel);
  @Input() set getCurrentChannel(value: Channel) {
    this._items.next(value);
  }

  get currentChannel(): Channel {
    return this._items.getValue();
  }

  filteredUsers: UserProfile[] = [];
  constructor(
    public userService: UserService,
    public utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.subscribeToItems();
  }

  subscribeToItems() {
    this._items.subscribe((currChannel) => {
      if (currChannel) {
        this.getChannelUsers(currChannel);
      }
    });
  }

  getChannelUsers(currChannel: Channel) {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      if (users) {
        this.filteredUsers = users.filter((user) => {
          return (currChannel.usersIds || []).includes(user.uid);
        });
      }
    });
  }

  close() {
    this.utilityService.closeComponent('channel-profile');
  }

  openAddUser() {
    const channelProfile = document.getElementById('channel-profile');
    channelProfile?.classList.add('hidden');
    const addUser = document.getElementById('channel-add-user');
    addUser?.classList.remove('hidden');
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe([this.usersSubscription]);
  }
}
