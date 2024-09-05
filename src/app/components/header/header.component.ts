import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ProfileMainComponent } from '../profile-main/profile-main.component';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, RouterLink, ProfileMainComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  profileOpen = false;
  allUsers: UserProfile[] = [];
  currentUser: UserProfile = {
    email: '',
    active: false,
    name: '',
    password: '',
    uid: '',
  };

  private usersSubscription!: Subscription;
  @ViewChild(ProfileMainComponent) profileMainComponent!: ProfileMainComponent;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;

      let filteredUser = this.allUsers.find((user) => {
        return user.uid === 'AVMklDakbn3jph5hNNyf';
      });
      if (filteredUser) {
        this.currentUser = filteredUser;
      }
    });
  }

  openMenu() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openProfile() {
    this.profileOpen = true;
  }

  closeProfile() {
    this.profileOpen = false;
    this.profileMainComponent.editProfile = false;
    this.profileMainComponent.closeEditProfile();
  }

  logoutMainUser() {
    this.currentUser.active = false;
    this.userService.updateUser(this.currentUser, this.currentUser.uid);
  }
}
