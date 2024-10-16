import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { Message } from '../../models/message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { MessageLeftComponent } from '../message-left/message-left.component';
import { MessageRightComponent } from '../message-right/message-right.component';
import { UtilityService } from '../../services/utility.service';
import { DirectChatService } from '../../services/direct-chat.service';
import { SendMessageComponent } from '../send-message/send-message.component';
import { Channel } from '../../models/channels';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    FormsModule,
    MessageLeftComponent,
    MessageRightComponent,
    SendMessageComponent,
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent implements OnInit, OnDestroy {
  private threadSubscription!: Subscription;
  private messageSubscription!: Subscription;
  private userSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeParentSubscription?: Subscription;
  subscriptions: Subscription[] = [
    this.channelSubscription,
    this.messageSubscription,
    this.userSubscription,
    this.threadSubscription,
    this.routeSubscription,
    this.routeParentSubscription!,
  ];
  sentThread: any = {
    text: '',
    image: '',
  };
  currentMessageId: string = '';
  currentChannelId: string = '';
  currentUserId: string = '';
  currentThreads: Message[] = [];
  messageById: Message[] = [];
  currentChannel: Channel = {} as Channel;
  userById: UserProfile = {} as UserProfile;
  threadActive: boolean = true;
  collectionType: string = 'channels';
  routePath: string = 'channels';
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  constructor(
    public threadService: ThreadService,
    public messageService: MessageService,
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    public directChatService: DirectChatService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.setThreads();
    this.getCurrentChannel();
    this.getMessageById();
    this.getCurrentThreads();
  }

  setThreads() {
    this.routeSubscription = this.route.paramMap.subscribe(async (paramMap) => {
      const id = paramMap.get('id');
      const msgId = paramMap.get('msgId');
      if (id && msgId) {
        this.currentChannelId = id;
        this.currentMessageId = msgId;
        this.getThreads();
        this.getMessages();
        this.channelService.subChannelById(this.currentChannelId);
      }
    });
  }

  getThreads() {
    this.threadService.subThreadList(
      this.currentChannelId,
      this.currentMessageId,
      this.routePath,
    );
  }

  getMessages() {
    if (this.threadService.threadIsOpen) {
      this.messageService.unsubscribeFromMessages();
      this.messageService.subMessageList(this.currentChannelId, this.routePath);
    }
  }

  getCurrentThreads() {
    this.threadSubscription = this.threadService.threads$.subscribe(
      (threads) => {
        this.currentThreads = this.utilityService.sortedArray(threads);
        this.utilityService.scrollToBottom(this.endOfChat);
      },
    );
  }

  getMessageById() {
    this.messageSubscription = this.messageService.messages$
      .pipe(
        map((messages) =>
          messages.find((message) => message.uid == this.currentMessageId),
        ),
      )
      .subscribe((currMsg) => {
        if (currMsg) {
          this.messageById = [currMsg];
        }
      });
  }

  getCurrentChannel() {
    this.channelSubscription = this.channelService.channelById$.subscribe(
      (channel) => {
        if (channel) {
          this.currentChannel = channel;
        }
      },
    );
  }

  getCurrentUserId() {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        this.currentUserId = this.utilityService.getIdByParam(paramMap, 'id');
      },
    );
  }

  onSubmitting(messageForm: NgForm) {
    if (messageForm.valid) {
      this.threadService.sendThread(
        this.sentThread,
        this.currentChannelId,
        this.currentMessageId,
        this.currentUserId,
        this.routePath,
      );
    }
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
