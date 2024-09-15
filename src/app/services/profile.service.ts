import { Injectable } from '@angular/core';
import { UserProfile } from '../models/users';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profileIsOpen: boolean = false;
  mainProfileIsOpen: boolean = false;

  profileUser: UserProfile = {
    address : {
      street: '',
      city: ''
    },
    email : '',
    active: false,
    name : '',
    password : '',
    profileImage : '',
    uid : ''
  }

  public usersSubscription!: Subscription;
  allUsers: UserProfile[] = [];

  constructor(public userService: UserService) { }

  searchUser(nameOfUser: string){
    this.usersSubscription = this.userService.users$.subscribe(users => {
      this.allUsers = users;
      
      let filteredUser = this.allUsers.find((user) => {
        return user.name === nameOfUser;
      });
      if (filteredUser) {
        this.profileUser = filteredUser;
      }
    });

  }

  openProfile(){
    this.profileIsOpen = true;
  }

  closeProfile(){
    this.profileIsOpen = false;
  }

  openMainProfile(){
    this.mainProfileIsOpen = true;
  }

  closeMainProfiel(){
    this.mainProfileIsOpen = false;
  }
}
