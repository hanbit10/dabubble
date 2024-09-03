import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginCreateAccountService {
currentState: string = 'log-in';
name: string = '';
mail: string = '';
passwort: string = '';
profileAvatar: string = '/assets/img/icons/profile-big.svg';
  constructor() { }

logUser() {
  console.log(this.name,this.mail,this.passwort);
  this.currentState='create-avatar';
}
}
