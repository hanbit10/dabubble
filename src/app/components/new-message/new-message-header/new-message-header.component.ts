import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-new-message-header',
  standalone: true,
  imports: [],
  templateUrl: './new-message-header.component.html',
  styleUrl: './new-message-header.component.scss',
})
export class NewMessageHeaderComponent implements OnInit {
  private channelSubscription!: Subscription;
  private routeParentSubscription?: Subscription;
  currentUserId: string = '';
  selectedUsers: [] = [];
  allChannels: any[] = [];
  contents: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public channelService: ChannelService,
  ) {}
  ngOnInit(): void {
    this.routeParentSubscription = this.route.parent?.paramMap.subscribe(
      (paramMap) => {
        const id = paramMap.get('id');
        console.log('new message id', paramMap.get('id'));
        if (id) {
          this.currentUserId = id;
          console.log('new message header', this.currentUserId);
        }
      },
    );

    this.channelSubscription = this.channelService.channels$
      .pipe(
        map((channels) =>
          channels.filter((channel) =>
            channel.usersIds.includes(this.currentUserId),
          ),
        ),
      )
      .subscribe((filteredChannels) => {
        this.allChannels = [];
        console.log('new message header', filteredChannels);
        filteredChannels.forEach((channel) => {
          if (channel && channel.uid) {
            this.allChannels.push(channel);
          }
        });
        console.log('new message header', this.allChannels);
      });
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-new-message')
    );

    let result: any[] = [];
    let input = inputBox.value;
    if (input.length) {
      if (input.startsWith('#')) {
        result = this.allChannels.filter((channel) => {
          const keyword = input.slice(1).toLowerCase(); // Remove the '#' from input for comparison
          return channel.name?.toLowerCase().includes(keyword);
        });
        console.log(result);
      }
      this.contents = result;
    }

    console.log(this.contents);
  }
}
