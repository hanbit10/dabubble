import { Component, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ChannelService } from '../../services/channel.service';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [PickerModule, FormsModule, CommonModule],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss'
})
export class MessageRightComponent {
  @Input()userName = '';
  settingIsOpen: boolean = false;
  editMessageIsOpen: boolean = false;

  public editTextArea: string = 'Welche Version ist aktuell von Angular?';
  public isEmojiPickerVisible: boolean = false;
  public addEmoji(event: any) {
    this.editTextArea = `${this.editTextArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  constructor(public profileService: ProfileService, public channelService: ChannelService){}

  openProfile(){
    this.profileService.openMainProfile();
  }

  openSettings(){
    if (this.settingIsOpen) {
      this.settingIsOpen = false;
    }else{
      this.settingIsOpen = true;
    }
  }

  closeSettings(){
    this.settingIsOpen = false;
  }

  editMessage(){
    this.editMessageIsOpen = true;
  }

  closeEditMessage(){
    this.editMessageIsOpen = false;
    this.settingIsOpen = false;
    this.editTextArea = 'Welche Version ist aktuell von Angular?';
  }
}
