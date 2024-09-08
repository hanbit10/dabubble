import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../models/users';
import { Router } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

@Component({
  selector: 'app-log-in-card',
  standalone: true,
  imports: [RouterLink, FormsModule, ],
  templateUrl: './log-in-card.component.html',
  styleUrl: './log-in-card.component.scss',
})
export class LogInCardComponent {
  googleAuth = new GoogleAuthProvider();
  users: UserProfile[] = [];
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

  userLogin() {
    let user: UserProfile;
    let userIndex: number;
    if (this.logService.loginMail && this.logService.loginPassword) {
      userIndex = this.users.findIndex(
        (i) => i.email === this.logService.loginMail
      );
      user = this.users[userIndex];
      console.log(user);
      if (this.logService.loginPassword === user.password) {
        this.router.navigate([`/main/${user.uid}`]);
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
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken;
    }
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    this.router.navigate([`/main/${user.uid}`]);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });  
  }

 

  setGoogleUser() {

  }

}


