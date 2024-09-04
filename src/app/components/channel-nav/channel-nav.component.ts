import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
})
export class ChannelNavComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  public usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  allUsers: any[] = [];
  allChannels: any[] = [];
  filtering: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public userService: UserService,
    public channelService: ChannelService
  ) {}
  async ngOnInit() {
    // this.userService.getAllUsersOnSnapshot();
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
      console.log('this is all users', this.allUsers);
    });
    this.channelSubscription = this.channelService.channels$.subscribe(
      (channels) => {
        this.allChannels = channels;
      }
    );
    this.toogleDirectMessage();
  }
  createChannel() {
    const createChannel = document.getElementById('channel-create');
    createChannel?.classList.remove('hidden');
  }

  toogleDirectMessage() {
    if (isPlatformBrowser(this.platformId)) {
      const dropdownIcon = document.getElementById('dropdown-icon');
      const dropdownBtn = document.getElementById('dropdown-btn');
      if (dropdownBtn) {
        console.log(this.filtering);
        dropdownBtn.addEventListener('click', (event) => {
          if (dropdownIcon && this.filtering) {
            dropdownIcon.classList.add('rotate-down');
          }
          if (dropdownIcon && !this.filtering) {
            dropdownIcon.classList.remove('rotate-down');
          }
        });
      }
    }
  }
}
