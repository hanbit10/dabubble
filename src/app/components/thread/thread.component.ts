import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';

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
  constructor(
    public channelService: ChannelService,
    public threadService: ThreadService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(messageForm: NgForm) {
    if (messageForm.valid) {
    }
  }
}
