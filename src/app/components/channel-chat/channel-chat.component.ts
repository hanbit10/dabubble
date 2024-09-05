import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ActivatedRoute } from '@angular/router';
import { concatMapTo, map, Subscription } from 'rxjs';
import { Channel } from '../../models/channels';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [ChannelHeaderComponent],
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
        console.log('channel id', this.channelId);
        this.channelSubscription = this.channelService.channels$
          .pipe(
            map((channels) =>
              channels.find((channel) => channel.uid === this.channelId)
            )
          )
          .subscribe((currentChannel) => {
            if (currentChannel) {
              this.currentChannel = currentChannel;
              console.log('currentChannel', this.currentChannel);
            } else {
              console.log('Channel not found');
            }
          });
      }
    });
  }
}
