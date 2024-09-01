import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { ChannelService } from '../../services/channel.service';

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

  keywords: UserProfile[] = [];
  contents: UserProfile[] = [];
  chosen: UserProfile[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public userService: UserService,
    public channelService: ChannelService
  ) {}

  async ngOnInit(): Promise<void> {
    this.keywords = await this.userService.getAllUsers();
    console.log('keywords', this.keywords);
    if (isPlatformBrowser(this.platformId)) {
      this.closeCard();
      this.nextForm();
      this.setUserSearchBar();
    }
  }

  saveToChosen(content: any) {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    let index = this.keywords.indexOf(content);
    this.chosen.push(content);
    this.keywords.splice(index, 1);
    this.contents = [];
    inputBox.value = '';
  }

  removeFromChosen(chosed: any) {
    let index = this.chosen.indexOf(chosed);
    this.keywords.push(chosed);
    this.chosen.splice(index, 1);
  }

  setUserSearchBar() {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    inputBox?.addEventListener('keyup', () => {
      let result: any[] = [];
      let input = inputBox.value;
      if (input.length) {
        result = this.keywords.filter((keyword) => {
          return keyword.name.firstName
            .toLowerCase()
            .includes(input.toLowerCase());
        });
      }
      console.log(result);
      this.display(result);
    });
  }

  display(result: any[]) {
    this.contents = result;
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
      console.log('creating a new channel', this.newChannel);
      this.channelService.createNewChannel(this.newChannel, this.chosen);
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
