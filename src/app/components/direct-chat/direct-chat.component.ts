import { Component, inject, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { ActivatedRoute } from '@angular/router';
import { MessageLeftComponent } from '../message-left/message-left.component';
import { MessageRightComponent } from '../message-right/message-right.component';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [ProfileUserComponent, MessageLeftComponent, MessageRightComponent],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  firestore: Firestore = inject(Firestore);
  public usersSubscription!: Subscription;
  allUsers: UserProfile[] = [];
  user: UserProfile = {
    uid: '',
  };
  userId = '';

  private routeSub: Subscription = new Subscription;

  constructor(public userService: UserService, private route: ActivatedRoute, public profileService: ProfileService) {}

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userId = params['id'];  
      
      this.usersSubscription = this.userService.users$.subscribe(users => {
        this.allUsers = users;
  
        let filteredUser = this.allUsers.find((user) => {
          return user.uid === this.userId;
        });
        if (filteredUser) {
          this.user = filteredUser;
        }
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  openProfile(){
    this.profileService.openProfile();
    this.profileService.profileUser = this.user;
  }
}
