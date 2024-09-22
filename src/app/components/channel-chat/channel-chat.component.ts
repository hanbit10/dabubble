import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ActivatedRoute } from '@angular/router';
import { concatMapTo, map, Subscription } from 'rxjs';
import { Channel } from '../../models/channels';
import { ChannelProfileComponent } from './channel-profile/channel-profile.component';
import { ChannelAddUserComponent } from './channel-add-user/channel-add-user.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { MessageLeftComponent } from '../message-left/message-left.component';
import { MessageRightComponent } from '../message-right/message-right.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [
    ChannelHeaderComponent,
    ChannelProfileComponent,
    ChannelAddUserComponent,
    ChannelEditComponent,
    MessageLeftComponent,
    MessageRightComponent,
    FormsModule,
  ],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss',
})
export class ChannelChatComponent implements OnInit {
  private channelSubscription!: Subscription;
  private messageSubscription!: Subscription;
  currentChannelId: string = '';
  currentUserId: string = '';
  allChannels: any[] = [];
  currentChannel: Channel = {} as Channel;
  currentMessages: Message[] = [];
  sentMessage: any = {
    text: '',
    image: '',
  };

  constructor(
    public channelService: ChannelService,
    public messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentChannelId = id;
        this.messageService.subMessageList(this.currentChannelId);
        this.channelSubscription = this.channelService.channels$
          .pipe(
            map((channels) =>
              channels.find((channel) => channel.uid === this.currentChannelId)
            )
          )
          .subscribe((currentChannel) => {
            if (currentChannel) {
              this.currentChannel = currentChannel;
            } else {
              console.log('Channel not found');
            }
          });
      }
    });

    this.route.parent?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentUserId = id;
      }
    });

    this.messageSubscription = this.messageService.messages$.subscribe(
      (messages) => {
        this.currentMessages = messages.sort((a, b) => {
          if (a.sentAt && b.sentAt) {
            return a.sentAt.toDate().getTime() - b.sentAt.toDate().getTime();
          }
          return 0;
        });
      }
    );
  }

  hoursPassed(date: Date | undefined): number {
    const validDate = new Date(date ?? new Date());
    const timeDiff = new Date().getTime() - validDate.getTime();
    console.log(timeDiff / (1000 * 60 * 60));
    return timeDiff / (1000 * 60 * 60);
  }

  shouldShowTimestamp(currentIndex: number): boolean {
    const previousMessage = this.currentMessages[currentIndex - 1];
    const currentMessage = this.currentMessages[currentIndex];
    const previousDate = previousMessage.sentAt?.toDate();
    const currentDate = currentMessage.sentAt?.toDate();
    if (previousDate && currentDate) {
      const timeDifference = currentDate.getTime() - previousDate.getTime();

      // 24 hours in milliseconds
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // Get the time difference in milliseconds

      // If the difference is greater than or equal to 24 hours, return true
      console.log(timeDifference >= twentyFourHoursInMs);
      return timeDifference >= twentyFourHoursInMs;
    } else {
      return false;
    }
  }

  getCurrentDate(date: Date | undefined) {
    const validDate = new Date(date ?? new Date());
    const formattedDate = validDate.toLocaleDateString('de-DE', {
      weekday: 'long', // Full name of the day
      day: 'numeric', // Numeric day (e.g., 17)
      month: 'long', // Full name of the month (e.g., September)
    });
    return formattedDate;
  }

  onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
      this.messageService.sendMessage(
        this.sentMessage,
        this.currentChannelId,
        this.currentUserId
      );
    }
  }
}
