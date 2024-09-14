import { Component } from '@angular/core';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

  constructor(public channelService: ChannelService){}
}
