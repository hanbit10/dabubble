import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class ChannelAddUserComponent implements OnInit, OnDestroy {
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
  allUsers: UserProfile[] = [];
  contents: UserProfile[] = [];
  constructor(
    public userService: UserService,
    public utilityService: UtilityService,
    public channelService: ChannelService,
  ) {}

  ngOnInit(): void {
    this.subscribeToItems();
    this.onClick();
  }

  subscribeToItems() {
    this._items.subscribe((currChannel) => {
      if (currChannel && currChannel.usersIds) {
        this.usersSubscription = this.userService.users$.subscribe((users) => {
          this.allUsers = this.userService.getUsers(users);
          this.filteredUsers = this.allUsers.filter((user) => {
            return !currChannel.usersIds.includes(user.uid);
          });
        });
      }
    });
  }

  onClick() {
    document.onclick = (event) => {
      const target = event.target as HTMLElement;
      if (target.id !== 'result-box') {
        this.contents = [];
      }
    };
  }

  close() {
    this.selectedUsers = [];
    this.utilityService.closeComponent('channel-add-user');
  }

  saveToChosen(content: any) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-channel')
    );
    let index = this.filteredUsers.indexOf(content);
    this.selectedUsers.push(content);
    this.filteredUsers.splice(index, 1);
    this.contents = [];
    inputBox.value = '';
  }

  removeFromChosen(chosed: any) {
    let index = this.selectedUsers.indexOf(chosed);
    this.filteredUsers.push(chosed);
    this.selectedUsers.splice(index, 1);
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-channel')
    );
    let result: any[] = [];
    let input = inputBox.value;
    if (input.length) {
      result = this.filteredUsers.filter((keyword) => {
        return keyword.name?.toLowerCase().includes(input.toLowerCase());
      });
    }
    this.contents = result;
  }

  addUser() {
    if (this.selectedUsers.length) {
      this.channelService.addUser(this.currentChannel.uid, this.selectedUsers);
      this.utilityService.closeComponent('channel-add-user');
      this.selectedUsers = [];
    }
  }

  ngOnDestroy() {
    this.utilityService.unsubscribe([this.usersSubscription]);
  }
}
