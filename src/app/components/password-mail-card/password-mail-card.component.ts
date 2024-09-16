import { Component, Inject } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-password-mail-card',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './password-mail-card.component.html',
  styleUrl: './password-mail-card.component.scss'
})
export class PasswordMailCardComponent {

  constructor(public logService: LoginCreateAccountService) {}

sendMail(contactForm: NgForm) {
  
}

}
