import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/users';
import { Channel } from '../../../models/channels';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss',
})
export class ChannelHeaderComponent implements OnInit {
  private usersSubscription!: Subscription;
  private _items = new BehaviorSubject<Channel>({} as Channel);
  @Input() set getCurrentChannel(value: Channel) {
    this._items.next(value);
  }

  get currentChannel(): Channel {
    return this._items.getValue();
  }
  filteredUsers: UserProfile[] = [];
  constructor(public userService: UserService) {}
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

  openProfile() {
    const channelProfile = document.getElementById('channel-profile');
    channelProfile?.classList.remove('hidden');
  }
}
