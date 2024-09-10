import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-add-user',
  standalone: true,
  imports: [],
  templateUrl: './channel-add-user.component.html',
  styleUrl: './channel-add-user.component.scss',
})
export class ChannelAddUserComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}

  close() {
    const cardClose = document.querySelector('.card-close-add-user');
    cardClose?.addEventListener('click', () => {
      const channelProfile = document.getElementById('channel-add-user');
      channelProfile?.classList.add('hidden');
    });
  }
}
