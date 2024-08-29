import { Component } from '@angular/core';

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [],
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
})
export class ChannelNavComponent {
  createChannel() {
    const createChannel = document.getElementById('channel-create');
    if (createChannel) {
      createChannel.classList.remove('hidden');
    }
  }
}
