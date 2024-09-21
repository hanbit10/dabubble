import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../models/message';

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
  private _items = new BehaviorSubject<Message>({} as Message);
  @Input() set getMessage(value: Message) {
    this._items.next(value);
  }
  get currentMessage(): Message {
    return this._items.getValue();
  }

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
