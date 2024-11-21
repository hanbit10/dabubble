import { Component, inject } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-password-mail-card',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule, CommonModule],
  templateUrl: './password-mail-card.component.html',
  styleUrl: './password-mail-card.component.scss',
})
export class PasswordMailCardComponent {
  http = inject(HttpClient);
  firestore: Firestore = inject(Firestore);
  constructor(
    public logService: LoginCreateAccountService,
    public userService: UserService,
  ) {}

  Data = {
    email: 'notyou01@hotmail.com',
    name: 'Hanbit chang',
    message: '123123',
  };

  index: number = -1;

  async sendMail(contactForm: NgForm) {
    contactForm.control.markAllAsTouched();
    this.index = this.logService.findUserIndex(this.Data.email);
    const user = await this.userService.getUserByEmail(this.Data.email);
    const ref = collection(this.firestore, 'mail');
    let data = {
      to: this.Data.email,
      message: {
        subject: 'Hello from Firebase!',
        text: `This is a text email body. https://dabubble-340.developerakademie.net/reassignpassword/${user.uid}`,
      },
    };

    if (this.formIsValid(contactForm)) {
      console.log('Sending Data:', this.Data);
      const querySnapshot = await addDoc(ref, data);
    } else {
      console.warn('Form is not valid');
    }
  }

  formIsValid(contactForm: NgForm) {
    return contactForm.submitted && contactForm.form.valid && this.index !== -1;
  }
}
