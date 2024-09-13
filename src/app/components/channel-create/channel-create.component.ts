import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { ChannelService } from '../../services/channel.service';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
import { ActivatedRoute } from '@angular/router';

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
  private usersSubscription!: Subscription;
  keywords: UserProfile[] = [];
  contents: UserProfile[] = [];
  selectedUsers: UserProfile[] = [];
  currentUserId: string = '';
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentUserId = id;
      }
    });
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.keywords = JSON.parse(JSON.stringify(users));
    });
    if (isPlatformBrowser(this.platformId)) {
      this.nextForm();
    }
  }

  saveToChosen(content: any) {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    let index = this.keywords.indexOf(content);
    this.selectedUsers.push(content);
    this.keywords.splice(index, 1);
    this.contents = [];
    inputBox.value = '';
  }

  removeFromChosen(chosed: any) {
    let index = this.selectedUsers.indexOf(chosed);
    this.keywords.push(chosed);
    this.selectedUsers.splice(index, 1);
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    let result: any[] = [];
    let input = inputBox.value;
    if (input.length) {
      result = this.keywords.filter((keyword) => {
        return keyword.name?.toLowerCase().includes(input.toLowerCase());
      });
    }
    this.contents = result;
  }
  close() {
    this.selectedUsers = [];
    this.contents = [];
    this.resetCard();
    this.utilityService.close('channel-create');
  }

  resetCard() {
    this.resetInputValues();
    this.resetForm();
  }

  resetInputValues() {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    const channelDescription = <HTMLInputElement>(
      document.getElementById('channel-description')
    );
    const channelName = <HTMLInputElement>(
      document.getElementById('channel-name')
    );
    const cardTitle = <HTMLElement>document.getElementById('card-title');
    cardTitle.innerText = 'Channel erstellen';
    inputBox.value = '';
    channelName.value = '';
    channelDescription.value = '';
  }

  resetForm() {
    const firstForm = document.getElementById('first-form');
    const secondForm = document.getElementById('second-form');
    const nextForm = document.getElementById('next-form');
    const channelSubmit = document.getElementById('channel-submit');
    firstForm?.classList.remove('hidden');
    secondForm?.classList.add('hidden');
    nextForm?.classList.remove('hidden');
    channelSubmit?.classList.add('hidden');
  }

  createChannel(channelForm: NgForm) {
    if (channelForm.valid) {
      console.log('creating a new channel', this.newChannel);
      this.channelService.createNewChannel(
        this.newChannel,
        this.selectedUsers,
        this.currentUserId
      );
      const createChannel = document.getElementById('channel-create');
      createChannel?.classList.add('hidden');
      this.close();
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
      nextForm.classList.add('hidden');
      channelSubmit.classList.remove('hidden');
      if (cardTitle && cardDescription) {
        cardTitle.innerHTML = 'Leute hinzufügen';
        cardDescription.innerHTML = '';
      }
    });
  }
}
