import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../models/users';

@Component({
  selector: 'app-log-in-card',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './log-in-card.component.html',
  styleUrl: './log-in-card.component.scss'
})

export class LogInCardComponent {
  users: UserProfile[] = [];
  constructor (public logService: LoginCreateAccountService, public dataBase: UserService) {
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
    let userIndex: number;
    userIndex = this.users.findIndex( i => i.email === this.logService.loginMail);
    console.log(this.users[userIndex]);


  }
}
