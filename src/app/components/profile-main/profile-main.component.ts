import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

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
  userId = '';

  private routeSub: Subscription = new Subscription;
  private usersSubscription!: Subscription;

  constructor(private userService: UserService, private route: ActivatedRoute, public profileService: ProfileService) { }
  editProfile = false;
  @Input() newMail = '';
  @Input() newName = '';

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userId = params['id']; 

      this.usersSubscription = this.userService.users$.subscribe(users => {
        this.allUsers = users;
  
        let filteredUser = this.allUsers.find((user) => {
          return user.uid === this.userId;
        });
        if (filteredUser) {
          this.currentUser = filteredUser;
        }
      }); 
    });
  }
  

  closeProfile() {
    this.profileService.closeMainProfiel();
    this.editProfile = false;
  }

  openEditProfile() {
    this.editProfile = true;
    this.profileService.openMainProfile();
  }

  closeEditProfile() {
    this.editProfile = false;
    this.newMail = '';
    this.newName = '';
  }

  safeEditProfile(ngform: NgForm) {
    if (ngform.valid) {
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

  openEditPicture(){
    this.profileService.editProfilePicIsOpen = true;
  }
}
