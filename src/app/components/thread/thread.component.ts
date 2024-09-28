import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Message } from '../../models/message';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { UserProfile } from '../../models/users';
import { UserService } from '../../services/user.service';
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
  sentThread: any = {
    text: '',
    image: '',
  };
  currentMessageId: string = '';
  currentChannelId: string = '';
  currentUserId: string = '';
  currentThreads: Message[] = [];
  currentMessage: any;
  currentChannel: any;
  messageUser: any;

  constructor(
    public threadService: ThreadService,
    public messageService: MessageService,
    public channelService: ChannelService,
    public userService: UserService,
    private route: ActivatedRoute,
  ) {}
  async ngOnInit(): Promise<void> {
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
      }
    });

    this.route.parent?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentUserId = id;
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

    this.currentMessage = await this.messageService.getMessageById(
      this.currentChannelId,
      this.currentMessageId,
      'channels',
    );

    this.currentChannel = await this.channelService.getChannelById(
      this.currentChannelId,
    );

    this.messageUser = await this.userService.getUserById(
      this.currentMessage.sentBy,
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
