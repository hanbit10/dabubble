import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../models/users';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss',
})
export class ProfileUserComponent implements OnInit {
  user: UserProfile = {
    uid: '',
  };
  profileIsOpen = false;

  constructor(public profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileIsOpen = this.profileService.profileIsOpen;
    this.user = this.profileService.profileUser;
  }

  closeProfile() {
    this.profileService.closeProfile();
  }

  newMessage() {}
}
