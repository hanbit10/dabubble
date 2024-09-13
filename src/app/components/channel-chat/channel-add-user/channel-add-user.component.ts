import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Channel } from '../../../models/channels';
import { UserService } from '../../../services/user.service';
import { UserProfile } from '../../../models/users';
import { UtilityService } from '../../../services/utility.service';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-channel-add-user',
  standalone: true,
  imports: [],
  templateUrl: './channel-add-user.component.html',
  styleUrl: './channel-add-user.component.scss',
})
export class ChannelAddUserComponent implements OnInit {
  private usersSubscription!: Subscription;
  private _items = new BehaviorSubject<Channel>({} as Channel);
  @Input() set getCurrentChannel(value: Channel) {
    this._items.next(value);
  }
  get currentChannel(): Channel {
    return this._items.getValue();
  }
  filteredUsers: UserProfile[] = [];
  selectedUsers: UserProfile[] = [];
  keywords: UserProfile[] = [];
  contents: UserProfile[] = [];
  constructor(
    public userService: UserService,
    public utilityService: UtilityService,
    public channelService: ChannelService
  ) {}
  ngOnInit(): void {
    this._items.subscribe((currChannel) => {
      if (currChannel) {
        this.usersSubscription = this.userService.users$.subscribe((users) => {
          if (users) {
            this.keywords = JSON.parse(JSON.stringify(users));
            this.filteredUsers = users.filter((user) => {
              return (currChannel.usersIds || []).includes(user.uid);
            });
          }
        });
      }
    });
  }

  close() {
    this.utilityService.close('channel-add-user');
  }

  saveToChosen(content: any) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-channel')
    );
    let index = this.keywords.indexOf(content);
    this.selectedUsers.push(content);
    this.keywords.splice(index, 1);
    this.contents = [];
    inputBox.value = '';
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-channel')
    );
    let result: any[] = [];
    let input = inputBox.value;
    if (input.length) {
      result = this.keywords.filter((keyword) => {
        return keyword.name?.toLowerCase().includes(input.toLowerCase());
      });
    }
    this.contents = result;
  }

  addUser() {
    if (this.selectedUsers.length) {
      console.log(this.currentChannel.uid);
      this.channelService.addUser(this.currentChannel.uid, this.selectedUsers);
    }
  }
}
