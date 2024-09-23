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
import { Message } from '../../models/message';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [
    ProfileUserComponent,
    MessageLeftComponent,
    MessageRightComponent,
    FormsModule,
  ],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
})
export class DirectChatComponent {
  firestore: Firestore = inject(Firestore);
  public usersSubscription!: Subscription;
  allUsers: UserProfile[] = [];
  otherUser: UserProfile = {
    uid: '',
  };
  otherUserId: string = '';
  currentUserId: string = '';
  private routeSub: Subscription = new Subscription();

  sentMessage: any = {
    text: '',
    image: '',
  };
  currentMessages: Message[] = [];

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public profileService: ProfileService
  ) {}

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.otherUserId = params['id'];

      this.usersSubscription = this.userService.users$.subscribe((users) => {
        this.allUsers = users;

        let filteredUser = this.allUsers.find((user) => {
          return user.uid === this.otherUserId;
        });
        if (filteredUser) {
          this.otherUser = filteredUser;
        }
      });
    });

    this.route.parent?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        console.log('current User id', id);
        console.log('other user id', this.otherUserId);
      }
    });
  }

  onSubmit(messageForm: NgForm) {
    // if (messageForm.valid) {
    //   this.messageService.sendMessage(
    //     this.sentMessage,
    //     this.currentChatId,
    //     this.currentUserId,
    //     'chats'
    //   );
    // }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  openProfile() {
    this.profileService.openProfile();
    this.profileService.profileUser = this.otherUser;
  }
}
