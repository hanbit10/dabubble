import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUserComponent } from '../profile-user/profile-user.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message-left',
  standalone: true,
  imports: [ProfileUserComponent, PickerModule, CommonModule],
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

  public editTextArea: string = 'Welche Version ist aktuell von Angular?';
  public isEmojiPickerVisible: boolean = false;
  public addEmoji(event: any) {
    this.editTextArea = `${this.editTextArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  private routeSub: Subscription = new Subscription();
  public usersSubscription!: Subscription;
  formattedTime?: string;

  constructor(
    private route: ActivatedRoute,
    public profileService: ProfileService,
    public userService: UserService,
    public channelService: ChannelService
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

    const date: Date | undefined = this.currentMessage.sentAt?.toDate();
    const validDate = new Date(date ?? new Date());

    this.formattedTime = validDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  openProfile() {
    // this.profileService.searchUser(this.userName);

    this.profileService.openProfile();
  }
}
