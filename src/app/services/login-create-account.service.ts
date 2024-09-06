import { Injectable } from '@angular/core';
import { UserProfile } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class LoginCreateAccountService {

currentState: string = 'log-in';
userCreated:boolean = false;
loginMail: string = '';
loginPassword: string = '';

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

captureUser() {
  console.log(this.profile);
  this.currentState='create-avatar';
}


}
