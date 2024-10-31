import { Component, inject } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-password-mail-card',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule, CommonModule],
  templateUrl: './password-mail-card.component.html',
  styleUrl: './password-mail-card.component.scss',
})
export class PasswordMailCardComponent {
  http = inject(HttpClient);
  constructor(public logService: LoginCreateAccountService) {}

  Data = {
    email: 'notyou01@hotmail.com',
    name: 'Hanbit chang',
    message: '123123',
  };

  index: number = -1;

  sendMail(contactForm: NgForm) {
    contactForm.control.markAllAsTouched();
    this.index = this.logService.findUserIndex(this.Data.email);

    if (this.formIsValid(contactForm)) {
      console.log('Sending Data:', this.Data);
    } else {
      console.warn('Form is not valid');
    }
  }

  formIsValid(contactForm: NgForm) {
    return contactForm.submitted && contactForm.form.valid && this.index !== -1;
  }
}
