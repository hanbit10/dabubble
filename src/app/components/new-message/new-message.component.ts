import { Component } from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { NewMessageHeaderComponent } from './new-message-header/new-message-header.component';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [NewMessageHeaderComponent, SendMessageComponent],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss',
})
export class NewMessageComponent {}
