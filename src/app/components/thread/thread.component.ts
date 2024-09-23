import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Message } from '../../models/message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [FormsModule],
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

  constructor(
    public threadService: ThreadService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      const msgId = paramMap.get('msgId');
      if (id && msgId) {
        console.log('is it working?', id);
        this.currentChannelId = id;
        this.currentMessageId = msgId;
        this.threadService.subThreadList(
          this.currentChannelId,
          this.currentMessageId
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
      }
    );
  }

  onSubmitting(messageForm: NgForm) {
    if (messageForm.valid) {
      console.log(this.currentChannelId);
      console.log(this.currentMessageId);
      this.threadService.sendThread(
        this.sentThread,
        this.currentChannelId,
        this.currentMessageId,
        this.currentUserId
      );
    }
  }
}
