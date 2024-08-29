import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [RouterModule],
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
