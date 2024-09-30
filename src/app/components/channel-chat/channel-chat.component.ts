import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
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
import { Timestamp } from '@angular/fire/firestore';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { UtilityService } from '../../services/utility.service';

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
  ],
  providers: [KeyValuePipe],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss',
})
export class ChannelChatComponent implements OnInit, OnDestroy {
  private channelSubscription!: Subscription;
  private messageSubscription!: Subscription;
  private routeSubscription: Subscription = new Subscription();
  private paramsParentSubscription?: Subscription = new Subscription();
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

  constructor(
    public channelService: ChannelService,
    public messageService: MessageService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');

      if (id) {
        this.currentChannelId = id;
        console.log('this is currentChannel id', this.currentChannelId);
        this.messageService.subMessageList(this.currentChannelId, 'channels');

        this.paramsParentSubscription = this.route.parent?.paramMap.subscribe(
          (paramMap) => {
            const parentId = paramMap.get('id');
            if (parentId) {
              this.currentUserId = parentId;
            }
          },
        );

        this.messageSubscription = this.messageService.messages$.subscribe(
          (messages) => {
            console.log('messages', messages);
            this.currentMessages = messages.sort((a, b) => {
              if (a.sentAt && b.sentAt) {
                return (
                  a.sentAt.toDate().getTime() - b.sentAt.toDate().getTime()
                );
              }
              return 0;
            });
            console.log('sorted messages', this.currentMessages);
          },
        );

        this.channelSubscription = this.channelService.channels$
          .pipe(
            filter((channels) => channels.length > 0), // Only proceed when channels is not empty
            map((channels) => {
              console.log('Emitted Channels:', channels); // Log emitted channels
              return channels.find(
                (channel) => channel.uid === this.currentChannelId,
              );
            }),
          )
          .subscribe((currentChannel) => {
            console.log('Current Channel Found:', currentChannel); // Log the found channel
            if (currentChannel) {
              this.currentChannel = currentChannel;
            }
          });
      }
    });
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
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.paramsParentSubscription?.unsubscribe();
  }
}
