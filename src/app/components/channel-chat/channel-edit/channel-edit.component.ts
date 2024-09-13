import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ChannelService } from '../../../services/channel.service';
import { UserService } from '../../../services/user.service';
import { Channel } from '../../../models/channels';

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
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public channelService: ChannelService
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
            }
          });
      }
    });
  }
}
