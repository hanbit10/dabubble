import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../models/users';




@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent implements OnInit {
  @Input() user: UserProfile = {
    uid: ''
  };
  @Output() close = new EventEmitter<void>();

  constructor(){}

  ngOnInit(): void {
    
  }

  onClose() {
    this.close.emit();
  }

  newMessage(){

  }
}
