import { Component, Input } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/channels';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent {

  @Input() currentChannelId!: string;
  @Input() currentUserId!: string;  
  @Input() currentChannel: Channel = {} as Channel;
  Message: any = {
    text: '',
    image: '',
  };

  constructor( public messService: MessageService) {}

  postMessage() {
    if (this.Message.text.length) {
      this.messService.sendMessage(
        this.Message,
        this.currentChannelId,
        this.currentUserId,
        'channels'
      );
      this.Message.text = '';  
    }
  }


}
