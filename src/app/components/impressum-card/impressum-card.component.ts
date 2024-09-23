import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';

@Component({
  selector: 'app-impressum-card',
  standalone: true,
  imports: [],
  templateUrl: './impressum-card.component.html',
  styleUrl: './impressum-card.component.scss'
})
export class ImpressumCardComponent {

constructor(public logService: LoginCreateAccountService) {}

}
