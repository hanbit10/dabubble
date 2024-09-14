import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ProfileUserComponent],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss'
})
export class MessageLeftComponent {
  profileIsOpen = false;
  

  allUsers: UserProfile[] = [];
  messageUser: UserProfile = {
    uid: '',
  };

  @Input()userName = '';

  private routeSub: Subscription = new Subscription;
  public usersSubscription!: Subscription;

  constructor(private route: ActivatedRoute, public profileService: ProfileService, public userService: UserService, public channelService :ChannelService){}

  openProfile(){
    this.profileService.searchUser(this.userName);
 
    this.profileService.openProfile();
  }

}
