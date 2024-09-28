import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [FormsModule, MessageLeftComponent, MessageRightComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent implements OnInit {
  private threadSubscription!: Subscription;
  private messageSubscription!: Subscription;
  private userSubscription!: Subscription;
  sentThread: any = {
    text: '',
    image: '',
  };
  currentMessageId: string = '';
  currentChannelId: string = '';
  currentUserId: string = '';
  currentThreads: Message[] = [];
  messageById: Message[] = [];
  userById: UserProfile = {} as UserProfile;
  threadActive: boolean = true;

  constructor(
    public threadService: ThreadService,
    public messageService: MessageService,
    public userService: UserService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      const msgId = paramMap.get('msgId');
      if (id && msgId) {
        this.currentChannelId = id;
        this.currentMessageId = msgId;
        this.threadService.subThreadList(
          this.currentChannelId,
          this.currentMessageId,
        );
        this.messageService.subMessageList(this.currentChannelId, 'channels');
      }
    });

    this.route.parent?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentUserId = id;
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
        this.currentChannelId,
        this.currentMessageId,
        this.currentUserId,
      );
    }
  }
}
