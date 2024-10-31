import { Component, OnInit } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { ReassignPasswordCardComponent } from '../../components/reassign-password-card/reassign-password-card.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReassignPasswordCardComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  constructor(public logService: LoginCreateAccountService) {}
  ngOnInit(): void {}
}
