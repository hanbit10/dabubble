import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
  sentMessage: any = {
    text: '',
    image: '',
  };
  currentMessageId: string = '';
  currentChannelId: string = '';

  constructor(
    public channelService: ChannelService,
    public threadService: ThreadService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.firstChild?.firstChild?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentMessageId = id;
      }
    });

    this.route.firstChild?.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentChannelId = id;
      }
    });
  }

  onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
    }
  }
}
