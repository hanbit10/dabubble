import { Injectable } from '@angular/core';
import { UserProfile } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class LoginCreateAccountService {

users: UserProfile[] = [];
currentState: string = 'reassign-password';
loginMail: string = '';
loginPassword: string = '';
userPopup: boolean = false;
userMessage: string = '';


profile: UserProfile = {
  address : {
    street: '',
    city: ''
  },
  email : '',
  active: false,
  name : '',
  password : '',
  profileImage : '/assets/img/icons/profile-big.svg',
  uid : ''
}

  constructor() {}  

  findUserIndex(searchMail: string) {
    return this.users.findIndex((index) => index.email === searchMail);
  }

  findUserIndexId(id: string) {
    return this.users.findIndex((index) => index.uid === id);
  }

  captureUser() {
    console.log(this.profile);
    this.currentState='create-avatar';
  }


}
