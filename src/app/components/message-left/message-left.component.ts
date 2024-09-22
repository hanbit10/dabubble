import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
import { Timestamp } from '@angular/fire/firestore';
import { UtilityService } from '../../services/utility.service';
import { Channel } from '../../models/channels';

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
  get currentMessage(): Message {
    return this._items.getValue();
  }

  profileIsOpen = false;
  allUsers: UserProfile[] = [];
  messageUser: UserProfile = {} as UserProfile;

  allThreads: any[] = [];
  currentChannelId: string = '';
  currentUserId: string = '';

  public editTextArea: string = 'Welche Version ist aktuell von Angular?';
  public isEmojiPickerVisible: boolean = false;
  public addEmoji(event: any) {
    this.editTextArea = `${this.editTextArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }
  private threadSubscription!: Subscription;
  private routeSub: Subscription = new Subscription();
  public usersSubscription!: Subscription;
  formattedCurrMsgTime?: string;
  formattedThreadTime?: string;

  constructor(
    private route: ActivatedRoute,
    public profileService: ProfileService,
    public userService: UserService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public utilityService: UtilityService
  ) {}
  ngOnInit(): void {
    this.usersSubscription = this.userService.users$
      .pipe(
        map((users) =>
          users.find((user) => user.uid === this.currentMessage.sentBy)
        )
      )
      .subscribe((currUser) => {
        if (currUser) {
          this.messageUser = currUser;
        }
      });

    this.route.paramMap.subscribe(async (paramMap) => {
      const currentChannelId = paramMap.get('id');
      if (currentChannelId && this.currentMessage.uid) {
        console.log('currentChannelId', currentChannelId);
        console.log('currentMessageId', this.currentMessage.uid);
        this.allThreads = await this.threadService.getAllThreads(
          currentChannelId,
          this.currentMessage.uid
        );
      }
    });

    this.formattedCurrMsgTime = this.utilityService.getFormattedTime(
      this.currentMessage.sentAt!
    );
    this.formattedThreadTime = this.utilityService.getFormattedTime(
      this.currentMessage.lastThreadReply!
    );
  }

  openProfile() {
    // this.profileService.searchUser(this.userName);

    this.profileService.openProfile();
  }
}
