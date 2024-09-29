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
import { DirectChatService } from '../../services/direct-chat.service';
import { MessageService } from '../../services/message.service';
import { UtilityService } from '../../services/utility.service';

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
  private routeSubscription: Subscription = new Subscription();
  private routeParentSubscription?: Subscription = new Subscription();
  private messageSubscription!: Subscription;
  currentChatId: string = '';

  sentMessage: any = {
    text: '',
    image: '',
  };
  currentMessages: Message[] = [];

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public profileService: ProfileService,
    public directChatService: DirectChatService,
    public messageService: MessageService,
    public utilityService: UtilityService,
  ) {}

  async ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.otherUserId = params['id'];
      this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
        async (paramMap) => {
          const id = paramMap.get('id');
          if (id) {
            this.currentUserId = id;

            const exist = this.directChatService.isExistingChat(
              this.otherUserId,
              this.currentUserId,
            );
            if ((await exist) == false) {
              this.directChatService.createNewChat(
                this.otherUserId,
                this.currentUserId,
              );
              console.log('new chat created');
            }

            this.currentChatId = await this.directChatService.getChatId(
              this.otherUserId,
              this.currentUserId,
            );

            this.messageService.subMessageList(this.currentChatId, 'chats');
          }
        },
      );

      this.usersSubscription = this.userService.users$.subscribe((users) => {
        this.allUsers = users;
        let filteredUser = this.allUsers.find((user) => {
          return user.uid === this.otherUserId;
        });
        if (filteredUser) {
          this.otherUser = filteredUser;
        }
      });

      this.messageSubscription = this.messageService.messages$.subscribe(
        (messages) => {
          this.currentMessages = messages.sort((a, b) => {
            if (a.sentAt && b.sentAt) {
              return a.sentAt.toDate().getTime() - b.sentAt.toDate().getTime();
            }
            return 0;
          });
        },
      );
    });
  }

  async onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
      this.currentChatId = await this.directChatService.getChatId(
        this.otherUserId,
        this.currentUserId,
      );
      this.messageService.sendMessage(
        this.sentMessage,
        this.currentChatId,
        this.currentUserId,
        'chats',
      );
    }
  }

  openProfile() {
    this.profileService.openProfile();
    this.profileService.profileUser = this.otherUser;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.routeParentSubscription?.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }
}
