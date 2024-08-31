import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.scss'
})
export class ProfileMainComponent {
  @Input()profileOpen = true;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit(); 
  }

  editProfile = false;

  openEditProfile(){
    this.editProfile = true;
  }

  closeEditProfile(){
    this.editProfile = false;
  }
}
