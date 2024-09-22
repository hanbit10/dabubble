import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { LogInCardComponent } from '../../components/log-in-card/log-in-card.component';
import { NgIf } from '@angular/common';
import { CreateAccountCardComponent } from '../../components/create-account-card/create-account-card.component';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { CreateAvatarCardComponent } from '../../components/create-avatar-card/create-avatar-card.component';
import { PasswordMailCardComponent } from '../../components/password-mail-card/password-mail-card.component';
import { ReassignPasswordCardComponent } from '../../components/reassign-password-card/reassign-password-card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    MatInputModule,
    LogInCardComponent,
    NgIf,
    CreateAccountCardComponent,
    CreateAvatarCardComponent,
    PasswordMailCardComponent,
    ReassignPasswordCardComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {  
  constructor(public logService: LoginCreateAccountService) {}

}
