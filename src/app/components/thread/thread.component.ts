import { Component, Input, OnInit } from '@angular/core';
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
  sentMessage: any = {
    text: '',
    image: '',
  };
  currentMessageId: string = '';
  currentChannelId: string = '';
  currentUserId: string = '';
  currentThreads: Message[] = [];

  constructor(
    public channelService: ChannelService,
    public threadService: ThreadService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // Subscribe to the main route and all child routes in one block
    this.route.paramMap.subscribe((paramMap) => {
      // Get the current user ID from the main route
      this.currentUserId = paramMap.get('id') || '';

      // Get the current channel ID from the first child route (if exists)
      const firstChild = this.route.firstChild;
      if (firstChild) {
        firstChild.paramMap.subscribe((paramMap) => {
          this.currentChannelId = paramMap.get('id') || '';

          // Get the current message ID from the second child route (if exists)
          firstChild.firstChild?.paramMap.subscribe((paramMap) => {
            this.currentMessageId = paramMap.get('id') || '';
            this.threadService.subThreadList(
              this.currentChannelId,
              this.currentMessageId
            );
          });
        });
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

  onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
      console.log(this.sentMessage);
      this.threadService.sendThread(
        this.sentMessage,
        this.currentChannelId,
        this.currentMessageId,
        this.currentUserId
      );
    }
  }
}
