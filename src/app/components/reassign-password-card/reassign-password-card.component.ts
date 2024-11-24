import { Component, OnInit } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { UserService } from '../../services/user.service';
import { NgForm, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserProfile } from '../../models/users';

@Component({
  selector: 'app-reassign-password-card',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule],
  templateUrl: './reassign-password-card.component.html',
  styleUrl: './reassign-password-card.component.scss',
})
export class ReassignPasswordCardComponent {
  password: string = '';
  passwordCheck: string = '';
  passwordMatch: boolean = false;
  userId: string = '';
  // timeStamp: string = '';
  currentUser: UserProfile = {} as UserProfile;

  constructor(
    public logService: LoginCreateAccountService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.userService.users$.subscribe((users) => {
      users.find((user) => {
        if (user.uid === this.userId) {
          this.password = user.password || '';
          this.currentUser = user;
        }
      });
    });

    // console.log('get user id', this.userId);
    // this.timeStamp = this.route.snapshot.paramMap.get('timestamp') || '';
  }

  async changePassword(form: NgForm) {
    console.log('user', this.currentUser);
    if (this.currentUser.password?.length) {
      this.currentUser.password = this.passwordCheck;
      this.setPassword(this.currentUser);
    }
  }

  async setPassword(user: UserProfile) {
    try {
      await this.userService.updateUser(user, this.userId);
      setTimeout(() => {
        this.logService.currentState = 'log-in';
        document.body.style.overflowX = 'unset';
        this.logService.userMessage = 'Passwort erfolgreich geändert!';
        this.logService.userPopup = false;
      }, 1500);
      document.body.style.overflowX = 'hidden';
      this.logService.userPopup = true;
    } catch (error) {
      console.error('Fehler beim Ändern des Passwortes:', error);
    }
  }

  onPasswordCheck(event: any) {
    this.password === this.passwordCheck
      ? (this.passwordMatch = true)
      : (this.passwordMatch = false);
  }
}
