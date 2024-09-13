import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../models/users';
import { MessageUserService } from '../../services/message-user.service';



@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent implements OnInit {
  user: UserProfile = {
    uid: ''
  };
  profileIsOpen = false;

  constructor(public messageUserService: MessageUserService){}

  ngOnInit(): void {
    this.profileIsOpen = this.messageUserService.profileIsOpen;
    this.user = this.messageUserService.messageUser;
  }

  closeProfile() {
    this.messageUserService.profileIsOpen = false;
  }

  newMessage(){

  }
}
