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

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
})
export class ChannelNavComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  constructor(public userService: UserService) {}
  async ngOnInit(): Promise<void> {
    this.userService.getAllUsers();
  }
  createChannel() {
    const createChannel = document.getElementById('channel-create');
    if (createChannel) {
      createChannel.classList.remove('hidden');
    }
  }
}
