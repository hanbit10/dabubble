import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { Output, EventEmitter } from '@angular/core';
import { Channel } from '../../../models/channels';
import { UserProfile } from '../../../models/users';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-new-message-header',
  standalone: true,
  imports: [],
  templateUrl: './new-message-header.component.html',
  styleUrl: './new-message-header.component.scss',
})
export class NewMessageHeaderComponent implements OnInit, OnDestroy {
  private channelSubscription!: Subscription;
  private userSubscription!: Subscription;
  private routeParentSubscription?: Subscription;

  subscriptions: Subscription[] = [
    this.channelSubscription,
    this.userSubscription,
    this.routeParentSubscription!,
  ];

  @Output() newItemEvent = new EventEmitter<string>();

  currentUserId: string = '';
  selectedElement: any[] = [];
  allChannels: Channel[] = [];
  allUsers: UserProfile[] = [];
  contents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public channelService: ChannelService,
    public userService: UserService,
    public utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        const id = paramMap.get('id');
        console.log('new message id', paramMap.get('id'));
        if (id) {
          this.currentUserId = id;
          console.log('new message header', this.currentUserId);
        }
      },
    );

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
          if (channel && channel.uid) {
            this.allChannels.push(channel);
          }
        });
      });

    this.getAllUsers();
  }

  getAllUsers() {
    this.userSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = this.userService.getUsers(users);
    });
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-new-message')
    );

    let result: any[] = [];
    let input = inputBox.value;
    if (input.length) {
      if (input.startsWith('#')) {
        result = this.allChannels.filter((channel) => {
          const keyword = input.slice(1).toLowerCase(); // Remove the '#' from input for comparison
          return channel.name?.toLowerCase().includes(keyword);
        });
      } else if (input.startsWith('@')) {
        result = this.allUsers.filter((user) => {
          const keyword = input.slice(1).toLowerCase(); // Remove the '@' from input for comparison
          return user.name?.toLowerCase().includes(keyword);
        });
        console.log(result);
      } else {
        result = this.allUsers.filter((user) => {
          const keyword = input.toLowerCase();
          return user.email?.toLowerCase().includes(keyword);
        });
      }
      this.contents = result;
    } else {
      this.contents = [];
    }

    console.log(this.contents);
  }

  saveToChosen(content: any) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-new-message')
    );
    this.selectedElement.push(content);
    this.newItemEvent.emit(content);
    this.contents = [];
    inputBox.value = '';
  }

  removeFromChosen() {
    this.selectedElement = [];
    this.contents = [];
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
