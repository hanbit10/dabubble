import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserProfile } from '../../models/users';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-log-in-card',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf, FormsModule],
  templateUrl: './log-in-card.component.html',
  styleUrl: './log-in-card.component.scss',
})
export class LogInCardComponent {
  googleAuth = new GoogleAuthProvider();
  users: UserProfile[] = [];
  userNotFound: boolean = false;
  wrongPassword: boolean = false;

  constructor(
    public logService: LoginCreateAccountService,
    public dataBase: UserService,
    private router: Router
  ) {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.dataBase.getAllUsers();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  findUserIndex(searchMail: string) {
    return this.users.findIndex((index) => index.email === searchMail);
  }

  userLogin(ngForm: NgForm) {
    let user: UserProfile;
    let userIndex: number;
    ngForm.control.markAllAsTouched();
    if (ngForm.submitted && ngForm.form.valid) {
      userIndex = this.findUserIndex(this.logService.loginMail);
      user = this.users[userIndex];
      console.log(user);
      this.validateInput(user);
    }
  }

  async validateInput(user: UserProfile) {
    if (user === undefined) {
      this.userNotFound = true;
    } else {
      this.userNotFound = false;
      if (this.logService.loginPassword === user.password) {
        user.active = true;
        await this.dataBase.updateUser(user, user.uid);
        this.wrongPassword = false;
        this.router.navigate([`/main/${user.uid}`]);
      } else {
        this.wrongPassword = true;
      }
    }
  }

  guestLogin() {
    this.router.navigate([`/main/guest`]);
  }

  googleLogin() {
    const auth = getAuth();
    signInWithPopup(auth, this.googleAuth)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
        }
        const user = result.user;
        this.setGoogleUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async setGoogleUser(user: Object) {
    const userMail: string = (user as { email: string }).email;
    let userIndex: number = this.findUserIndex(userMail);
    let profile: UserProfile = this.logService.profile;
    if (userIndex === -1) {
      this.createGoogleUser(profile, user, userIndex, userMail);
    } else {
      this.users[userIndex].active = true;
    }
    this.router.navigate([`/main/${this.users[userIndex].uid}`]);
  }

  async createGoogleUser(
    profile: UserProfile,
    user: Object,
    userIndex: number,
    userMail: string
  ) {
    profile.active = true;
    profile.email = userMail;
    profile.name = (user as { displayName: string }).displayName;
    profile.profileImage = '/assets/img/profile/man1.svg';
    await this.dataBase.addUser(profile);
    await this.loadUsers();
    userIndex = this.findUserIndex(userMail);
  }
}
