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
  allUsers: any[] = [];
  constructor(public userService: UserService) {}
  async ngOnInit() {
    // this.userService.getAllUsersOnSnapshot();
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
      console.log('this is all users', this.allUsers);
    });
  }
  createChannel() {
    const createChannel = document.getElementById('channel-create');
    createChannel?.classList.remove('hidden');
  }
}
