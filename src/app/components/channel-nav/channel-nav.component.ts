import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
})
export class ChannelNavComponent {
  firestore: Firestore = inject(Firestore);
  public channelsSubscription!: Subscription;

  allChannels: any[] = [];
  constructor(public channelService: ChannelService) {}

  //async ngOnInit() {
  //  this.channelsSubscription = this.channelService.channels$.subscribe((channels) => {
  //    this.allChannels = channels;
  //    console.log('this is all channels', this.allChannels);
  //  });
  //}

  createChannel() {
    const createChannel = document.getElementById('channel-create');
    if (createChannel) {
      createChannel.classList.remove('hidden');
    }
  }
}
