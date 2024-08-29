import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.closeCard();
    }
  }

  closeCard() {
    const cardClose = document.getElementById('card-close');
    cardClose?.addEventListener('click', () => {
      const createChannel = document.getElementById('channel-create');
      createChannel?.classList.add('hidden');
    });
  }
  close() {
    this.resetCard();
  }

  resetCard() {}
}
