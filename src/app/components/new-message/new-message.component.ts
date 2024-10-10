import { Component, OnInit } from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { NewMessageHeaderComponent } from './new-message-header/new-message-header.component';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Channel } from '../../models/channels';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [NewMessageHeaderComponent, SendMessageComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss',
})
export class NewMessageComponent implements OnInit {
  private routeSubscription!: Subscription;
  currentUserId: string = '';
  currentChannel: Channel = {} as Channel;
  constructor(
    private route: ActivatedRoute,
    public channelService: ChannelService,
    public userService: UserService,
  ) {}
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.currentUserId = id;
      }
    });
  }
  onSubmit() {}

  addItem(newItem: any) {
    this.currentChannel = newItem;
    console.log('get current channel', this.currentChannel);
  }
}
