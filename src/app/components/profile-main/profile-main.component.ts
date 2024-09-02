import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.scss',
})
export class ProfileMainComponent implements OnInit {
  @Input() profileOpen = true;
  @Output() close = new EventEmitter<void>();
  allUsers: UserProfile[] = [];
  currentUser: UserProfile = {
    email: '',
    active: false,
    name: '',
    password: '',
    uid: '',
  };

  constructor(private userService: UserService) {}
  editProfile = false;
  @Input() newMail = '';
  @Input() newName = '';

  async ngOnInit() {
    this.allUsers = await this.userService.getAllUsers();

    let filteredUser = this.allUsers.find((user) => {
      return user.uid === 'AVMklDakbn3jph5hNNyf';
    });

    if (filteredUser) {
      this.currentUser = filteredUser;
    }
  }

  onClose() {
    this.close.emit();
  }

  openEditProfile() {
    this.editProfile = true;
  }

  closeEditProfile() {
    this.editProfile = false;
    this.newMail = '';
    this.newName = '';
  }

  safeEditProfile() {
    if (this.newMail == '') {
      this.currentUser.email = this.currentUser.email;
    } else {
      this.currentUser.email = this.newMail;
    }
    if (this.newName == '') {
      this.currentUser.name = this.currentUser.name;
    } else {
      this.currentUser.name = this.newName;
    }
    this.userService.updateUser(this.currentUser, this.currentUser.uid);
    this.newMail = '';
    this.newName = '';
    this.editProfile = false;
  }
}
