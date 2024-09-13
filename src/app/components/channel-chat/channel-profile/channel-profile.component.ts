import { Component, OnInit, Input } from '@angular/core';
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
export class ChannelProfileComponent implements OnInit {
  private usersSubscription!: Subscription;
  private _items = new BehaviorSubject<Channel>({} as Channel);
  @Input() set getCurrentChannel(value: Channel) {
    this._items.next(value);
  }

  filteredUsers: UserProfile[] = [];

  get currentChannel(): Channel {
    return this._items.getValue();
  }
  constructor(
    public userService: UserService,
    public utilityService: UtilityService
  ) {}
  ngOnInit(): void {
    this._items.subscribe((currChannel) => {
      if (currChannel) {
        this.usersSubscription = this.userService.users$.subscribe((users) => {
          if (users) {
            this.filteredUsers = users.filter((user) => {
              return (currChannel.usersIds || []).includes(user.uid);
            });
          }
        });
      }
    });
  }

  close() {
    this.utilityService.close('channel-profile');
  }

  openAddUser() {
    const channelProfile = document.getElementById('channel-profile');
    channelProfile?.classList.add('hidden');
    const addUser = document.getElementById('channel-add-user');
    addUser?.classList.remove('hidden');
  }
}
