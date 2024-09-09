import { Component, inject, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [ProfileUserComponent],
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
  profileIsOpen: boolean = false;

  private routeSub: Subscription = new Subscription;

  constructor(public userService: UserService, private route: ActivatedRoute) {}

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
    this.profileIsOpen = true;
  }

  closeProfile(){
    this.profileIsOpen = false;
  }
}
