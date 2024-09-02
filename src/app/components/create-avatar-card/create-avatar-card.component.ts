import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';

@Component({
  selector: 'app-create-avatar-card',
  standalone: true,
  imports: [],
  templateUrl: './create-avatar-card.component.html',
  styleUrl: './create-avatar-card.component.scss'
})
export class CreateAvatarCardComponent {

  constructor (public logService: LoginCreateAccountService){}

}
