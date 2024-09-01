import { Component, Input, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ProfileMainComponent } from '../profile-main/profile-main.component';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';

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
    mainUser: false,
    name: {
      firstName: '',
      lastName: ''
    },
    password: '',
    uid: ''
  };

  constructor(private userService: UserService){}

  async ngOnInit(){
    this.allUsers = await this.userService.getAllUsers();

    let filteredUser = this.allUsers.find((user) => {
      return user.mainUser === true;
    });

    if (filteredUser) {
      this.currentUser = filteredUser;
    }
  }

  openMenu(){
    this.menuOpen = true;
  }

  closeMenu(){
    this.menuOpen = false;
  }

  openProfile(){
    this.profileOpen = true;
  }

  closeProfile(){
    this.profileOpen = false;
  }

  logoutMainUser(){
    this.currentUser.mainUser = false;
    this.userService.updateUser(this.currentUser, this.currentUser.uid);
  }
 }
