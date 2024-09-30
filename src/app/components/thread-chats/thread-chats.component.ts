import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { Message } from '../../models/message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { MessageLeftComponent } from '../message-left/message-left.component';
import { MessageRightComponent } from '../message-right/message-right.component';
import { Channel } from '../../models/channels';
import { UtilityService } from '../../services/utility.service';
import { DirectChatService } from '../../services/direct-chat.service';

@Component({
  selector: 'app-thread-chats',
  standalone: true,
  imports: [FormsModule, MessageLeftComponent, MessageRightComponent],
  templateUrl: './thread-chats.component.html',
  styleUrl: './thread-chats.component.scss',
})
export class ThreadChatsComponent implements OnInit, OnDestroy {
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
  currentChatId: string = '';
  currentUserId: string = '';
  currentThreads: Message[] = [];
  messageById: Message[] = [];
  threadActive: boolean = true;
  routePath: string = 'chats';

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
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        const id = paramMap.get('id');
        if (id) {
          this.currentUserId = id;
        }
      },
    );
    this.routeSubscription = this.route.paramMap.subscribe(async (paramMap) => {
      const id = paramMap.get('id');
      const msgId = paramMap.get('msgId');
      if (id && msgId) {
        this.currentMessageId = msgId;
        this.currentChatId = await this.directChatService.getChatId(
          id,
          this.currentUserId,
        );
        console.log('thread chat', this.currentChatId);
        this.threadService.subThreadList(
          this.currentChatId,
          this.currentMessageId,
          this.routePath,
        );
        if (this.threadService.threadIsOpen) {
          this.messageService.subMessageList(
            this.currentChatId,
            this.routePath,
          );
        }
      }
    });

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

    this.threadSubscription = this.threadService.threads$.subscribe(
      (threads) => {
        this.currentThreads = threads.sort((a, b) => {
          if (a.sentAt && b.sentAt) {
            return a.sentAt.toDate().getTime() - b.sentAt.toDate().getTime();
          }
          return 0;
        });
      },
    );
  }

  onSubmitting(messageForm: NgForm) {
    if (messageForm.valid) {
      this.threadService.sendThread(
        this.sentThread,
        this.currentChatId,
        this.currentMessageId,
        this.currentUserId,
        this.routePath,
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe(),
    );
  }
}
