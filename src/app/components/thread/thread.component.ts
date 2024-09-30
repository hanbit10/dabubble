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
  selector: 'app-thread',
  standalone: true,
  imports: [FormsModule, MessageLeftComponent, MessageRightComponent],
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
  sentThread: any = {
    text: '',
    image: '',
  };
  currentMessageId: string = '';
  currentChannelId: string = '';
  currentUserId: string = '';
  currentThreads: Message[] = [];
  messageById: Message[] = [];
  currentChannel: any = {};
  userById: UserProfile = {} as UserProfile;
  threadActive: boolean = true;
  routePath: string = '';

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
      const routePath = this.route.snapshot.url[0]['path'];
      console.log(routePath);
      if (id && msgId) {
        this.currentChannelId = id;
        this.currentMessageId = msgId;
        this.routePath = routePath;
        if (routePath == 'chats') {
          console.log(id, this.currentUserId);
          this.currentChannelId = await this.directChatService.getChatId(
            id,
            this.currentUserId,
          );
          console.log('current chat id', this.currentChannelId);
          this.threadService.subThreadList(
            this.currentChannelId,
            this.currentMessageId,
            routePath,
          );
        } else if (routePath == 'channels') {
          this.threadService.subThreadList(
            this.currentChannelId,
            this.currentMessageId,
            routePath,
          );
        }

        console.log(this.threadService.threadIsOpen);
        if (this.threadService.threadIsOpen) {
          this.messageService.subMessageList(this.currentChannelId, routePath);
        }

        this.channelService.subChannelById(this.currentChannelId);
      }
    });

    this.channelSubscription = this.channelService.channelById$.subscribe(
      (channel) => {
        if (channel) {
          this.currentChannel = channel;
        }
      },
    );

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
        this.currentChannelId,
        this.currentMessageId,
        this.currentUserId,
        this.routePath,
      );
    }
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.threadSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.routeParentSubscription?.unsubscribe();
  }
}
