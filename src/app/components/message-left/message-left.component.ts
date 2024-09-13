import { Component, EventEmitter, Output } from '@angular/core';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { MessageUserService } from '../../services/message-user.service';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ProfileUserComponent],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss'
})
export class MessageLeftComponent {
  profileIsOpen = false;
  userName = 'Saskia Richter';

  allUsers: UserProfile[] = [];
  messageUser: UserProfile = {
    uid: '',
  };

  private routeSub: Subscription = new Subscription;
  public usersSubscription!: Subscription;

  constructor(private route: ActivatedRoute, public messageUserService: MessageUserService){}

  openProfile(){
    this.messageUserService.searchUser(this.userName);
    this.messageUserService.openProfile();
  }

  closeProfile(){

  }

}
