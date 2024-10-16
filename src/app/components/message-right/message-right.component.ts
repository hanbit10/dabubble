import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message, Reaction } from '../../models/message';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { ThreadService } from '../../services/thread.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { MessageService } from '../../services/message.service';
import { DirectChatService } from '../../services/direct-chat.service';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [PickerModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss',
})
export class MessageRightComponent implements OnInit, OnDestroy {
  private usersSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeParentSubscription?: Subscription;
  private _items = new BehaviorSubject<Message>({} as Message);

  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.routeSubscription,
    this.routeParentSubscription!,
  ];

  @Input() set getMessage(value: Message) {
    this._items.next(value);
  }
  @Input() threadActive!: boolean;
  @Input() collectionType!: string;

  get currentMessage(): Message {
    return this._items.getValue();
  }

  settingIsOpen: boolean = false;
  editMessageIsOpen: boolean = false;
  allUsers: UserProfile[] = [];
  messageUser: UserProfile = {} as UserProfile;
  currentChannelId: string = '';
  currentUserId: string = '';
  currentChatId: string = '';

  formattedTime?: string;
  formattedCurrMsgTime?: string;
  formattedThreadTime?: string;

  emojiPickerRight1: boolean = false;
  emojiPickerRight2: boolean = false;
  emojiPickerEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public profileService: ProfileService,
    public userService: UserService,
    public threadService: ThreadService,
    public utilityService: UtilityService,
    public messageService: MessageService,
    public directChatService: DirectChatService,
  ) {}

  ngOnInit(): void {
    this.getMessageUser();
    this.getCurrentUserId();
    this.getCurrentIds();
    this.getTime();
  }

  getMessageUser() {
    this.usersSubscription = this.userService.users$
      .pipe(
        map((users) =>
          users.find((user) => user.uid === this.currentMessage.sentBy),
        ),
      )
      .subscribe((currUser) => {
        if (currUser) {
          this.messageUser = currUser;
        }
      });
  }

  getCurrentUserId() {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      async (paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.currentUserId = id;
        }
      },
    );
  }

  getCurrentIds() {
    this.routeSubscription = this.route.paramMap.subscribe(async (paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentChannelId = id;
        if (this.collectionType == 'chats') {
          this.currentChatId = await this.directChatService.getChatId(
            id,
            this.currentUserId,
          );
        }
      }
    });
  }

  getTime() {
    this.formattedCurrMsgTime = this.utilityService.getFormattedTime(
      this.currentMessage.sentAt!,
    );

    this.formattedThreadTime = this.utilityService.getFormattedTime(
      this.currentMessage.lastThreadReply!,
    );
  }

  openProfile() {
    this.profileService.menuIsOpen = true;
    this.profileService.openMainProfile();
  }

  openSettings() {
    if (this.settingIsOpen) {
      this.settingIsOpen = false;
    } else {
      this.settingIsOpen = true;
    }
  }

  closeSettings() {
    this.settingIsOpen = false;
  }

  openEditMessage() {
    this.editMessageIsOpen = true;
  }

  closeEditMessage() {
    this.editMessageIsOpen = false;
    this.settingIsOpen = false;
  }

  editMessage() {
    this.editMessageIsOpen = false;
    this.settingIsOpen = false;
    if (this.collectionType == 'channels' && this.threadActive == false) {
      this.messageService.editMessage(
        this.currentMessage,
        this.currentChannelId,
        this.collectionType,
      );
    } else if (this.collectionType == 'chats' && this.threadActive == false) {
      console.log('chats', this.currentMessage);
      console.log(this.currentChatId);
      console.log(this.collectionType);
      this.messageService.editMessage(
        this.currentMessage,
        this.currentChatId,
        this.collectionType,
      );
    } else if (this.collectionType == 'channels' && this.threadActive == true) {
      this.threadService.editThread(
        this.currentMessage,
        this.currentChannelId,
        this.collectionType,
      );
    } else if (this.collectionType == 'chats' && this.threadActive == true) {
      this.threadService.editThread(
        this.currentMessage,
        this.currentChatId,
        this.collectionType,
      );
    }
  }

  handleReaction(reaction: Reaction, $index: number) {
    if (
      this.collectionType == 'channels' &&
      (this.threadActive == true || this.threadActive == false)
    ) {
      this.setHandleReaction(reaction, $index, this.currentChannelId);
    } else if (
      (this.collectionType == 'chats' && this.threadActive == false) ||
      this.threadActive == true
    ) {
      this.setHandleReaction(reaction, $index, this.currentChatId);
    }
  }

  setHandleReaction(reaction: Reaction, $index: number, collectionId: string) {
    this.messageService.handleSingleReaction(
      reaction,
      this.userService.mainUser.uid,
      this.currentMessage,
      collectionId,
      $index,
      this.collectionType,
      this.threadActive,
    );
  }

  selectEmoji(event: any, emojiPicker: boolean) {
    this.sendEmoji(event.emoji.native);
    emojiPicker = false;
  }

  sendEmoji(emoji: string) {
    if (
      this.collectionType == 'channels' &&
      (this.threadActive == false || this.threadActive == true)
    ) {
      this.setReactionEmoji(emoji, this.currentChannelId);
    } else if (
      this.collectionType == 'chats' &&
      (this.threadActive == false || this.threadActive == true)
    ) {
      this.setReactionEmoji(emoji, this.currentChatId);
    }
  }

  setReactionEmoji(emoji: string, collectionId: string) {
    this.messageService.giveReaction(
      emoji,
      this.userService.mainUser.uid,
      this.currentMessage,
      collectionId,
      this.collectionType,
      this.threadActive,
    );
  }

  closeEmojiPicker() {
    this.emojiPickerRight1 = false;
    this.emojiPickerRight2 = false;
  }

  addEmoji(event: any, text: string) {
    this.currentMessage.text = `${text}${event.emoji.native}`;
    this.emojiPickerEdit = false;
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
