import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/channels';
import { StorageService } from '../../services/storage.service';
import { NgIf } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { LoginCreateAccountService } from '../../services/login-create-account.service';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [FormsModule, NgIf, PickerModule],
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
  }
  messageFile: File | null = null;
  emojiPicker: boolean = false;
  users: UserProfile[] = [];
  channelUsers: UserProfile[] = [];
  channels: Channel[] = [];
  

  constructor(public messService: MessageService, public storage: StorageService, private userService: UserService, private logService: LoginCreateAccountService ) {}

  async ngOnInit() {
    this.users = await this.userService.getAllUsers();
  }

  async postMessage() {
    const content = this.Message;
    await this.uploadFile();
    this.Message.image = this.messService.messageFileURL;
    if (content.text.length || content.image.length) {
      this.messService.sendMessage(
        this.Message,
        this.currentChannelId,
        this.currentUserId,
        'channels'
      );
      content.text = '';
      content.image = '';
      this.messageFile = null;  
    }
  }

  async uploadFile() {
    if (this.messageFile instanceof File) {
      await this.storage.uploadFile(this.messageFile,'message_files');      
    } 
  }

  onSelect(event: any) {    
    if (event.target.files[0]) {      
      this.messageFile = event.target.files[0];       
    }
  }

  removeAttachment() {        
    this.messageFile = null;     
  }

  selectEmoji(event: any){
    this.Message.text += event.emoji.native;
    this.emojiPicker = false;
  }

  showUsers() {
    const channelIds = this.currentChannel.usersIds;
    this.channelUsers = this.users.filter( user => channelIds.includes(user.uid));
    console.log(this.channelUsers);
    
  }

}
