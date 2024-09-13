import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ActivatedRoute } from '@angular/router';
import { concatMapTo, map, Subscription } from 'rxjs';
import { Channel } from '../../models/channels';
import { ChannelProfileComponent } from './channel-profile/channel-profile.component';
import { ChannelAddUserComponent } from './channel-add-user/channel-add-user.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [
    ChannelHeaderComponent,
    ChannelProfileComponent,
    ChannelAddUserComponent,
    ChannelEditComponent,
  ],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss',
})
export class ChannelChatComponent implements OnInit {
  private channelSubscription!: Subscription;
  channelId: string = '';
  allChannels: any[] = [];
  currentChannel: Channel = {} as Channel;
  constructor(
    public channelService: ChannelService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.channelId = id;
        this.channelSubscription = this.channelService.channels$
          .pipe(
            map((channels) =>
              channels.find((channel) => channel.uid === this.channelId)
            )
          )
          .subscribe((currentChannel) => {
            if (currentChannel) {
              this.currentChannel = currentChannel;
            } else {
              console.log('Channel not found');
            }
          });
      }
    });

    this.route.parent?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
    });
  }
}
