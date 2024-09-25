import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';

@Component({
  selector: 'app-policy-card',
  standalone: true,
  imports: [],
  templateUrl: './policy-card.component.html',
  styleUrl: './policy-card.component.scss'
})
export class PolicyCardComponent {

  constructor(public logService: LoginCreateAccountService) {}

}
