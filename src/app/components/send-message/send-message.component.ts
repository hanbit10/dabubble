import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../models/channels';
import { StorageService } from '../../services/storage.service';
import { NgFor, NgIf } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { ChannelService } from '../../services/channel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [FormsModule, NgIf, PickerModule, NgFor],
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
  filteredUsers: UserProfile[] = [];
  selectUser: boolean = false;
  selectChannel: boolean = false;
  channels: Channel[] = [];
  filteredChannels: Channel[] = [];
  

  constructor(public messService: MessageService, public storage: StorageService, private userService: UserService, private logService: LoginCreateAccountService,
    public chanService: ChannelService, public route: ActivatedRoute) {}

  async ngOnInit() {
    this.users = await this.userService.getAllUsers();    
  }

  onKeyUp(event: KeyboardEvent) {    
    const text = this.Message.text;    
    const matchUsers = text.match(/@(\w*)$/);
    const matchChannels = text.match(/#(\w*)$/);
    this.matchUsers(matchUsers);
    this.matchChannels(matchChannels);    
  }

  matchUsers(match:string) {
    if (match) {
      this.showUsers();
      const searchTerm = match[1].toLowerCase();
      this.filteredUsers = this.channelUsers.filter(user =>
        user.name!.toLowerCase().startsWith(searchTerm)
      );
      this.selectUser = true;
    } else {
      this.selectUser = false;
      this.filteredUsers = [];
    }
  }

  matchChannels(match:string) {    
    if (match) {
      this.showChannels();
      const searchTerm = match[1].toLowerCase(); 
      this.filteredChannels = this.channels.filter(chan =>
        chan.name!.toLowerCase().startsWith(searchTerm)
      );
      this.selectChannel = true;
    } else {
      this.selectChannel = false;
      this.filteredChannels = [];
    }
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
    this.selectUser = false; 
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
    this.selectUser = !this.selectUser; 
    this.selectChannel = false;
    const channelIds = this.currentChannel.usersIds;
    this.channelUsers = this.users.filter( user => channelIds.includes(user.uid));
    console.log(this.channelUsers);       
    this.filteredUsers = this.channelUsers;    
  }

  showChannels() {
    this.selectChannel = !this.selectChannel;
    this.selectUser = false;
    this.channels = this.chanService.channels.filter( chan => 
      chan.usersIds.includes(this.currentUserId)
    )
    this.filteredChannels = this.channels;   
  }

  insertUser(username:string | undefined) {
    if (username) {
      if (this.Message.text.includes('@')) {        
        this.Message.text = this.Message.text.replace(/@\w*$/, `@${username}`);  
        if (!this.Message.text.includes(`@${username}`)) this.Message.text += `@${username}`;        
      } else {
        this.Message.text += `@${username}`;        
      }
      this.selectUser = false;
      this.filteredUsers = [];
    }    
  }

  insertChannel(channelname:string | undefined) {
    if (channelname) {
      if (this.Message.text.includes('#')) {        
        this.Message.text = this.Message.text.replace(/#\w*$/, `#${channelname}`);  
        if (!this.Message.text.includes(`#${channelname}`)) this.Message.text += `#${channelname}`;         
      } else {
        this.Message.text += `#${channelname}`;        
      }
      this.selectChannel = false;
      this.filteredChannels = [];
    }    
  }

}
