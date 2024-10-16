import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Message, Reaction } from '../../models/message';
import { ThreadService } from '../../services/thread.service';
import { UtilityService } from '../../services/utility.service';
import { MessageService } from '../../services/message.service';
import { DirectChatService } from '../../services/direct-chat.service';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ProfileUserComponent, PickerModule, CommonModule, RouterModule],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss',
})
export class MessageLeftComponent implements OnInit, OnDestroy {
  private threadSubscription!: Subscription;
  private usersSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeParentSubscription?: Subscription;
  private _items = new BehaviorSubject<Message>({} as Message);
  subscriptions: Subscription[] = [
    this.threadSubscription,
    this.usersSubscription,
    this.routeSubscription,
    this.routeParentSubscription!,
  ];
  @Input() set getMessage(value: Message) {
    this._items.next(value);
  }
  @Input() threadActive!: boolean;
  @Input() emojiActive!: boolean;
  @Input() collectionType!: string;

  get currentMessage(): Message {
    return this._items.getValue();
  }

  messageUser: UserProfile = {} as UserProfile;
  currentChannelId: string = '';
  currentChatId: string = '';
  currentUserId: string = '';

  formattedCurrMsgTime?: string;
  formattedThreadTime?: string;

  emojiPickerLeft1: boolean = false;
  emojiPickerLeft2: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public profileService: ProfileService,
    public userService: UserService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public utilityService: UtilityService,
    public messageService: MessageService,
    public directChatService: DirectChatService,
  ) {}

  ngOnInit(): void {
    this.getMessageUser();
    this.getCurrentUserId();
    this.getCurrentChannelId();
    this.getTime();
  }

  getMessageUser() {
    this.usersSubscription = this.userService.users$
      .pipe(
        map((users) =>
          users.find((user) => user.uid == this.currentMessage.sentBy),
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
      (paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.currentUserId = id;
        }
      },
    );
  }

  getCurrentChannelId() {
    this.routeSubscription = this.route.paramMap.subscribe(async (paramMap) => {
      const id = paramMap.get('id');
      if (id && this.currentMessage.uid) {
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
    if (this.messageUser.name) {
      this.profileService.searchUser(this.messageUser.name);
    }
    this.profileService.openProfile();
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

  selectEmoji(event: any, emojiPicker: any) {
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
    this.emojiPickerLeft1 = false;
    this.emojiPickerLeft2 = false;
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
