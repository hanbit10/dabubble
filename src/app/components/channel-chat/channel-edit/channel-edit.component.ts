import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { Channel } from '../../../models/channels';
import { UserProfile } from '../../../models/users';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-channel-edit',
  standalone: true,
  imports: [],
  templateUrl: './channel-edit.component.html',
  styleUrl: './channel-edit.component.scss',
})
export class ChannelEditComponent implements OnInit {
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  channel: Channel = {} as Channel;
  channelCreatedBy: UserProfile = {} as UserProfile;
  editName: boolean = false;
  editDescription: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.channelSubscription = this.channelService.channels$
          .pipe(
            map((channels) => channels.find((channel) => channel.uid === id))
          )
          .subscribe((currChannel) => {
            if (currChannel) {
              this.channel = currChannel;
              this.usersSubscription = this.userService.users$
                .pipe(
                  map((users) =>
                    users.find((user) => user.uid == currChannel.createdBy)
                  )
                )
                .subscribe((user) => {
                  if (user) {
                    this.channelCreatedBy = user;
                  }
                });
            }
          });
      }
    });
  }

  close() {
    this.utilityService.closeComponent('channel-edit');
  }

  leaveChannel() {
    this.utilityService.closeComponent('channel-edit');
  }

  edit(type: string) {
    if (type == 'name') {
      this.editName = true;
    }
    if (type == 'description') {
      this.editDescription = true;
    }
  }
  save(type: string) {
    if (type == 'name') {
      this.editName = false;
    }
    if (type == 'description') {
      this.editDescription = false;
    }
  }
}
