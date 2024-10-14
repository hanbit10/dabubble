import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Message } from '../../models/message';
import { ThreadService } from '../../services/thread.service';
import { UtilityService } from '../../services/utility.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ProfileUserComponent, PickerModule, CommonModule, RouterModule],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss',
})
export class MessageLeftComponent implements OnInit {
  private _items = new BehaviorSubject<Message>({} as Message);
  @Input() set getMessage(value: Message) {
    this._items.next(value);
  }
  @Input() threadActive!: boolean;
  @Input() collectionType!: string;
  get currentMessage(): Message {
    return this._items.getValue();
  }

  messageUser: UserProfile = {} as UserProfile;
  currentChannelId: string = '';
  currentUserId: string = '';

  private threadSubscription!: Subscription;
  private routeSub?: Subscription = new Subscription();
  public routeParentSubscription?: Subscription;
  public usersSubscription!: Subscription;
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
  ) { }

  ngOnInit(): void {
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

    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.currentUserId = id;
        }
      },
    );

    this.route.paramMap.subscribe(async (paramMap) => {
      const id = paramMap.get('id');
      if (id && this.currentMessage.uid) {
        this.currentChannelId = id;
      }
    });

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

  selectEmoji(event: any, emojiPicker: any) {
    this.messageService.giveReaction(
      event.emoji.native,
      this.userService.mainUser.uid,
      this.currentMessage,
      this.currentChannelId,
    );
    emojiPicker = false;
  }

  closeEmojiPicker() {
    this.emojiPickerLeft1 = false;
    this.emojiPickerLeft2 = false;
  }
}
