import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
import { SendMessageComponent } from '../send-message/send-message.component';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [
    ProfileUserComponent,
    MessageLeftComponent,
    MessageRightComponent,
    FormsModule,
    SendMessageComponent,
  ],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
})
export class DirectChatComponent {
  private usersSubscription!: Subscription;
  private messageSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeParentSubscription?: Subscription;
  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.messageSubscription,
    this.routeSubscription,
    this.routeParentSubscription!,
  ];
  allUsers: UserProfile[] = [];
  otherUser: UserProfile = {
    uid: '',
  };
  otherUserId: string = '';
  currentUserId: string = '';

  currentChatId: string = '';

  sentMessage: any = {
    text: '',
    image: '',
  };
  currentMessages: Message[] = [];
  threadActive: boolean = false;
  collectionType: string = 'chats';
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private preventAutoScroll: boolean = false;
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
      this.getChat();
      this.getUsers();
      this.getCurrentMessages();
    });
    this.setScrollToBottom();
  }

  setScrollToBottom() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (this.setScrollableElements(target)) {
        this.preventAutoScroll = false;
      } else {
        this.preventAutoScroll = true;
      }
    });
  }

  setScrollableElements(target: any) {
    return (
      target.closest('.contact-container') || target.id === 'directmessage'
    );
  }

  ngAfterViewChecked() {
    if (!this.preventAutoScroll) {
      this.messageContainer.nativeElement.scrollTo({
        top: this.messageContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.preventAutoScroll = true;
      }, 1000);
    }
  }

  getChat() {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      async (paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.currentUserId = id;
          await this.setChat();
        }
      },
    );
  }

  async setChat() {
    const chatExist = this.directChatService.isExistingChat(
      this.otherUserId,
      this.currentUserId,
    );
    await this.getNewChat(chatExist);
    this.currentChatId = await this.directChatService.getChatId(
      this.otherUserId,
      this.currentUserId,
    );
    this.messageService.subMessageList(this.currentChatId, 'chats');
  }

  async getNewChat(chatExist: any) {
    if ((await chatExist) == false) {
      this.directChatService.createNewChat(
        this.otherUserId,
        this.currentUserId,
      );
    }
  }

  getUsers() {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
      let filteredUser = this.allUsers.find((user) => {
        return user.uid === this.otherUserId;
      });
      if (filteredUser) {
        this.otherUser = filteredUser;
      }
    });
  }

  getCurrentMessages() {
    this.messageSubscription = this.messageService.messages$.subscribe(
      (messages) => {
        this.currentMessages = this.utilityService.sortedArray(messages);
      },
    );
  }

  async onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
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
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
