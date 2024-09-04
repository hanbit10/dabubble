import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-avatar-card',
  standalone: true,
  imports: [NgFor],
  templateUrl: './create-avatar-card.component.html',
  styleUrl: './create-avatar-card.component.scss'
})
export class CreateAvatarCardComponent {

  constructor (public logService: LoginCreateAccountService, private dataBase: UserService){}

  avatars:Array<string> = [
    '/assets/img/profile/man1.svg',
    '/assets/img/profile/man2.svg',
    '/assets/img/profile/man3.svg',
    '/assets/img/profile/man4.svg',
    '/assets/img/profile/woman1.svg',
    '/assets/img/profile/woman2.svg',
  ]

  chooseAvatar(path:string) {
    this.logService.profile.profileImage = path;
  }

  createUser() {  
    this.logService.currentState = 'log-in';
  }
}
