import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';

@Component({
  selector: 'app-create-account-card',
  standalone: true,
  imports: [],
  templateUrl: './create-account-card.component.html',
  styleUrl: './create-account-card.component.scss'
})
export class CreateAccountCardComponent {

  constructor (public logService: LoginCreateAccountService){}

}
