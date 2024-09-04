import { Component, inject, OnInit } from '@angular/core';
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

  constructor(
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
  }
  createChannel() {
    const createChannel = document.getElementById('channel-create');
    createChannel?.classList.remove('hidden');
  }
}
