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

  constructor(public profileService: ProfileService){}

  openProfile(){
    this.profileService.openMainProfile();
  }
}
