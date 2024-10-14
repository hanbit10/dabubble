import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ActivatedRoute } from '@angular/router';
import { concatMapTo, filter, map, Subscription } from 'rxjs';
import { Channel } from '../../models/channels';
import { ChannelProfileComponent } from './channel-profile/channel-profile.component';
import { ChannelAddUserComponent } from './channel-add-user/channel-add-user.component';
import { ChannelEditComponent } from './channel-edit/channel-edit.component';
import { MessageLeftComponent } from '../message-left/message-left.component';
import { MessageRightComponent } from '../message-right/message-right.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { SendMessageComponent } from '../send-message/send-message.component';

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
    CommonModule,
    SendMessageComponent,
  ],
  providers: [KeyValuePipe],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss',
})
export class ChannelChatComponent implements OnInit, OnDestroy {
  private channelSubscription!: Subscription;
  private messageSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeParentSubscription?: Subscription;
  subscriptions: Subscription[] = [
    this.channelSubscription,
    this.messageSubscription,
    this.routeSubscription,
    this.routeParentSubscription!,
  ];
  currentChannelId: string = '';
  currentUserId: string = '';
  allChannels: any[] = [];
  currentChannel: any = {} as Channel;
  currentMessages: Message[] = [];
  sentMessage: any = {
    text: '',
    image: '',
  };
  threadActive: boolean = false;
  collectionType: string = 'channels';
  @ViewChild('endOfChat') endOfChat!: ElementRef;
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private preventAutoScroll: boolean = false;

  constructor(
    public channelService: ChannelService,
    public messageService: MessageService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.subToMessage();
    this.getMessages();
    this.getCurrentChannel();
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (
        target.classList.contains('thread-icon') ||
        target.classList.contains('message-answer-button')
      ) {
        this.preventAutoScroll = true;
      } else {
        this.preventAutoScroll = false;
      }
    });
  }

  async ngAfterViewChecked(): Promise<void> {
    if (!this.preventAutoScroll) {
      await this.messageContainer.nativeElement.scrollTo({
        top: this.messageContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });

      setTimeout(() => {
        this.preventAutoScroll = true;
      }, 1000);
    }
  }

  scrollToBottom(): Promise<void> {
    return new Promise((resolve) => {
      this.messageContainer.nativeElement.scrollTo({
        top: this.messageContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });

      // Simulate scroll completion manually by resolving the promise after a reasonable scroll time
      // Adjust the duration as necessary based on your animation
      setTimeout(() => {
        resolve();
      }, 500); // Estimate the smooth scroll duration, this ensures it resolves only after the scroll
    });
  }

  public enableAutoScroll(): void {
    this.preventAutoScroll = false;
  }

  subToMessage() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentChannelId = id;
        this.messageService.subMessageList(this.currentChannelId, 'channels');
      }
    });
  }

  getCurrentChannel() {
    this.channelSubscription = this.channelService.channels$
      .pipe(
        filter((channels) => channels.length > 0),
        map((channels) => {
          return channels.find(
            (channel) => channel.uid === this.currentChannelId,
          );
        }),
      )
      .subscribe((currentChannel) => {
        if (currentChannel) {
          this.currentChannel = currentChannel;
        }
      });
  }

  getCurrentUserId() {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        const parentId = paramMap.get('id');
        if (parentId) {
          this.currentUserId = parentId;
        }
      },
    );
  }

  getMessages() {
    this.messageSubscription = this.messageService.messages$.subscribe(
      (messages) => {
        this.currentMessages = this.utilityService.sortedArray(messages);
      },
    );
  }

  onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
      this.messageService.sendMessage(
        this.sentMessage,
        this.currentChannelId,
        this.currentUserId,
        'channels',
      );
    }
    this.enableAutoScroll();
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
    this.messageService.unsubscribeFromMessages();
  }
}
