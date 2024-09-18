import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { UserService } from '../../services/user.service';
import { NgForm, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reassign-password-card',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './reassign-password-card.component.html',
  styleUrl: './reassign-password-card.component.scss',
})
export class ReassignPasswordCardComponent {
  password: string = '';
  passwordCheck: string = '';
  passwordMatch: boolean = false;

  constructor(
    public logService: LoginCreateAccountService,
    private storage: UserService
  ) {}

  sendMail(form: NgForm) {}

  onPasswordCheck(event: any) {
    
    this.password === this.passwordCheck
      ? (this.passwordMatch = true)
      : (this.passwordMatch = false);
  }
}
