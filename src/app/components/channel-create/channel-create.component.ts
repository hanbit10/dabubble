import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { ChannelService } from '../../services/channel.service';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { Channel, ChannelInfo } from '../../models/channels';

@Component({
  selector: 'app-channel-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './channel-create.component.html',
  styleUrl: './channel-create.component.scss',
})
export class ChannelCreateComponent implements OnInit, OnDestroy {
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private routeSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.channelSubscription,
    this.routeSubscription,
  ];
  newChannel: ChannelInfo = {
    name: '',
    description: '',
  };
  allUsers: UserProfile[] = [];
  contents: UserProfile[] = [];
  selectedUsers: UserProfile[] = [];
  allChannels: Channel[] = [];
  currentUserId: string = '';

  constructor(
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getCurrentUserId();
    this.getAllUsers();
    this.getAllChannels();
  }

  getCurrentUserId() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      this.currentUserId = this.utilityService.getIdByParam(paramMap, 'id');
    });
  }

  getAllUsers() {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = this.userService.getUsers(users);
    });
  }

  getAllChannels() {
    this.channelSubscription = this.channelService.channels$.subscribe(
      (channels) => {
        this.allChannels = channels;
      },
    );
  }

  saveToChosen(content: any) {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    let index = this.allUsers.indexOf(content);
    this.selectedUsers.push(content);
    this.allUsers.splice(index, 1);
    this.contents = [];
    inputBox.value = '';
  }

  removeFromChosen(chosed: any) {
    let index = this.selectedUsers.indexOf(chosed);
    this.allUsers.push(chosed);
    this.selectedUsers.splice(index, 1);
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>document.getElementById('input-box');
    let result: UserProfile[] = [];
    let input = inputBox.value;
    if (input.length) {
      result = this.allUsers.filter((keyword) => {
        return keyword.name?.toLowerCase().includes(input.toLowerCase());
      });
    }
    this.contents = result;
  }
  close() {
    this.selectedUsers = [];
    this.contents = [];
    this.newChannel.name = '';
    this.newChannel.description = '';
    this.resetCard();
    this.utilityService.closeComponent('channel-create');
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
    if (inputBox) inputBox.value = '';
    channelName.value = '';
    channelDescription.value = '';
  }

  resetForm() {
    const firstForm = document.getElementById('first-form');
    const secondForm = document.getElementById('second-form');
    const nextForm = document.getElementById('next-form');
    const channelSubmit = document.getElementById('channel-submit');
    const alertWrapper = document.getElementById('alert-wrapper');
    firstForm?.classList.remove('hidden');
    secondForm?.classList.add('hidden');
    nextForm?.classList.remove('hidden');
    channelSubmit?.classList.add('hidden');
    alertWrapper?.classList.add('hidden');
  }

  createChannel(channelForm: NgForm) {
    if (channelForm.valid) {
      this.channelService.createNewChannel(
        this.newChannel,
        this.selectedUsers,
        this.currentUserId,
      );
      const createChannel = document.getElementById('channel-create');
      createChannel?.classList.add('hidden');
      this.allUsers = [...this.allUsers, ...this.selectedUsers];
      this.close();
    }
  }

  nextForm() {
    const alertWrapper = document.getElementById('alert-wrapper');
    if (!this.checkChannelName()) {
      alertWrapper?.classList.remove('hidden');
    } else if (this.checkChannelName()) {
      this.getSecondForm();
      this.setCard();
      alertWrapper?.classList.add('hidden');
    }
  }

  getSecondForm() {
    const nextForm = document.getElementById('next-form');
    const firstForm = document.getElementById('first-form');
    const secondForm = document.getElementById('second-form');
    const channelSubmit = <HTMLButtonElement>(
      document.getElementById('channel-submit')
    );
    firstForm?.classList.add('hidden');
    secondForm?.classList.remove('hidden');
    nextForm?.classList.add('hidden');
    channelSubmit.classList.remove('hidden');
  }

  setCard() {
    const cardTitle = document.getElementById('card-title');
    const cardDescription = document.getElementById('card-description');
    if (cardTitle && cardDescription) {
      cardTitle.innerHTML = 'Leute hinzufügen';
      cardDescription.innerHTML = '';
    }
  }

  checkChannelName(): boolean {
    let check = true;
    this.allChannels.forEach((channel) => {
      if (channel.name === this.newChannel.name) {
        check = false;
      }
    });
    return check;
  }

  get channelSubmitDisabled(): boolean {
    const channelSubmit = document.getElementById('channel-submit');
    if (this.selectedUsers.length >= 1) {
      channelSubmit?.classList.remove('unvalid');
    } else if (this.selectedUsers.length < 1) {
      channelSubmit?.classList.add('unvalid');
    }
    return this.selectedUsers.length < 1;
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
