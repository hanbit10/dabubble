import { Component, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-message-right',
  standalone: true,
  imports: [],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss'
})
export class MessageRightComponent {
  @Input()userName = '';
  settingIsOpen: boolean = false;

  constructor(public profileService: ProfileService){}

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
    
  }
}
