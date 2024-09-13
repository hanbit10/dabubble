import { Injectable } from '@angular/core';
import { UserProfile } from '../models/users';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageUserService {

  profileIsOpen: boolean = false;

  messageUser: UserProfile = {
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

  searchUser(name: string){
    this.usersSubscription = this.userService.users$.subscribe(users => {
      this.allUsers = users;

      let filteredUser = this.allUsers.find((user) => {
        return user.name === name;
      });
      if (filteredUser) {
        this.messageUser = filteredUser;
      }
    });
  }

  openProfile(){
    this.profileIsOpen = true;
  }
}
