import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent implements OnInit {
  newChannel: any = {
    name: '',
    description: '',
  };
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.closeCard();
      this.nextForm();
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

  createChannel(channelForm: NgForm) {
    if (channelForm.valid) {
    }
  }

  nextForm() {
    const nextForm = document.getElementById('next-form');
    const firstForm = document.getElementById('first-form');
    const secondForm = document.getElementById('second-form');
    const channelSubmit = <HTMLButtonElement>(
      document.getElementById('channel-submit')
    );
    const cardTitle = document.getElementById('card-title');
    const cardDescription = document.getElementById('card-description');
    nextForm?.addEventListener('click', () => {
      firstForm?.classList.add('hidden');
      secondForm?.classList.remove('hidden');
      nextForm.classList.add('d-none');
      channelSubmit.classList.remove('d-none');
      if (cardTitle && cardDescription) {
        cardTitle.innerHTML = 'Leute hinzufügen';
        cardDescription.innerHTML = '';
      }
    });
  }
}
