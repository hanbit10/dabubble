import { Component, OnDestroy, OnInit } from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { NewMessageHeaderComponent } from './new-message-header/new-message-header.component';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { Channel } from '../../models/channels';
import { UserProfile } from '../../models/users';
import { DirectChatService } from '../../services/direct-chat.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [NewMessageHeaderComponent, SendMessageComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss',
})
export class NewMessageComponent implements OnInit, OnDestroy {
  private routeParentSubscription?: Subscription;
  currentCollection: Channel | UserProfile = {} as Channel | UserProfile;
  currentUserId: string = '';
  storageColl: string = '';
  currentCollectionId: string = '';
  otherUserId: string = '';
  constructor(
    private route: ActivatedRoute,
    public channelService: ChannelService,
    public userService: UserService,
    public directChatService: DirectChatService,
    public utilityService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
  }

  getCurrentUserId() {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (params) => {
        const id = params.get('id');
        if (id) {
          this.currentUserId = id;
        }
      },
    );
  }

  async addItem(newItem: any) {
    this.currentCollection = newItem;
    if (newItem.email) {
      this.storageColl = 'chats';
      this.currentCollectionId = await this.directChatService.getChatId(
        newItem.uid,
        this.currentUserId,
      );
      this.otherUserId = newItem.uid;
      console.log('get current id', this.currentCollectionId);
    } else if (newItem.createdAt) {
      this.storageColl = 'channels';
      this.currentCollectionId = newItem.uid;
    }
    console.log('get current id', this.currentCollection);
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe([this.routeParentSubscription!]);
  }
}
