import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { Channel, ChannelInfo } from '../../../models/channels';
import { UserProfile } from '../../../models/users';
import { UtilityService } from '../../../services/utility.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss',
})
export class ChannelEditComponent implements OnInit, OnDestroy {
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private allChannelSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeParentSubscription?: Subscription;

  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.channelSubscription,
    this.routeSubscription,
    this.allChannelSubscription,
    this.routeParentSubscription!,
  ];

  allChannels: Channel[] = [];
  currentChannel: Channel = {} as Channel;
  channelCreatedBy: UserProfile = {} as UserProfile;
  editName: boolean = false;
  editDescription: boolean = false;
  currentUserId: string = '';
  alert: boolean = false;
  updateChannel: ChannelInfo = {
    name: '',
    description: '',
  };

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.subscribeToRoute();
    this.getChannelsWithoutCurrent();
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
          this.setUpdateChannel(currChannel);
          this.getChannelCreatedBy(currChannel);
        }
      });
  }

  setUpdateChannel(currChannel: Channel) {
    this.updateChannel.name = currChannel.name;
    this.updateChannel.description = currChannel.description;
  }

  getChannelCreatedBy(currChannel: Channel) {
    this.usersSubscription = this.userService.users$
      .pipe(
        map((users) => users.find((user) => user.uid == currChannel.createdBy)),
      )
      .subscribe((user) => {
        if (user) {
          this.channelCreatedBy = user;
        }
      });
  }

  getCurrentUserId() {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        this.currentUserId = this.utilityService.getIdByParam(paramMap, 'id');
      },
    );
  }

  getChannelsWithoutCurrent() {
    this.allChannelSubscription = this.channelService.channels$
      .pipe(
        map((channels) =>
          channels.filter((channel) => channel.uid !== this.currentChannel.uid),
        ),
      )
      .subscribe((filteredChannels) => {
        this.allChannels = filteredChannels;
      });
  }

  close() {
    this.utilityService.closeComponent('channel-edit');
    this.editName = false;
    this.editDescription = false;
    this.alert = false;
    this.updateChannel.name = this.currentChannel.name;
  }

  leaveChannel() {
    this.utilityService.closeComponent('channel-edit');
    this.channelService.leaveChannel(
      this.currentChannel.uid,
      this.currentUserId,
    );
  }

  edit(type: string) {
    if (type == 'name') {
      this.editName = true;
    } else if (type == 'description') {
      this.editDescription = true;
    }
  }

  save(type: string) {
    if (type == 'name') {
      this.updateChannelName(type);
    } else if (type == 'description') {
      this.editDescription = false;
      this.updateChannelData(type);
    }
  }

  updateChannelName(type: string) {
    if (!this.checkChannelName()) {
      this.editName = true;
      this.alert = true;
    } else {
      this.editName = false;
      this.alert = false;
      this.updateChannelData(type);
    }
  }

  updateChannelData(type: string) {
    this.channelService.updateChannel(
      this.currentChannel.uid,
      type,
      this.updateChannel,
    );
  }

  checkChannelName(): boolean {
    let check = true;
    this.allChannels.forEach((channel) => {
      if (channel.name === this.updateChannel.name) {
        check = false;
      }
    });
    return check;
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
