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
  private routeSubscription!: Subscription;
  currentUserId: string = '';
  selectedUsers: [] = [];
  allChannels: any[] = [];
  content: any[] = [];

  constructor(
    public route: ActivatedRoute,
    public channelService: ChannelService,
  ) {}
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.currentUserId = params['id'];
    });

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
        filteredChannels.forEach((channel) => {
          if (channel && channel.uid) {
            this.allChannels.push(channel);
          }
        });
      });
  }

  setUserSearchBar($event: KeyboardEvent) {
    const inputBox = <HTMLInputElement>(
      document.getElementById('input-box-new-message')
    );

    let result: any[] = [];
    let input = inputBox.value;
    if (input.startsWith('#')) {
      result = this.allChannels.filter((channel) => {
        const keyword = input.slice(1).toLowerCase(); // Remove the '#' from input for comparison
        return channel.name.toLowerCase().includes(input.toLowerCase());
      });
    }
    this.content = result;
  }
}
