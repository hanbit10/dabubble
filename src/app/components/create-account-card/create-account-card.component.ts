import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-account-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-account-card.component.html',
  styleUrl: './create-account-card.component.scss'
})
export class CreateAccountCardComponent {

  constructor (public logService: LoginCreateAccountService){}

}
