import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-password-mail-card',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule],
  templateUrl: './password-mail-card.component.html',
  styleUrl: './password-mail-card.component.scss'
})
export class PasswordMailCardComponent {

  constructor(public logService: LoginCreateAccountService, private http: HttpClient) {}

  Data = {
    email: '',
    name: '',
    id: ''    
  };  

  index:number = -1;

  post = {
    endPoint: 'https://example.com/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  sendMail(contactForm: NgForm) {    
    contactForm.control.markAllAsTouched();
    this.index = this.logService.findUserIndex(this.Data.email);
    if (this.formIsValid(contactForm)) {
      this.getUserData();
      console.log(this.Data)
      //this.httpPost(contactForm);
    }
  }

  formIsValid(contactForm: NgForm) {
    return contactForm.submitted && contactForm.form.valid && this.index !== -1;
  }

  getUserData() {    
    const user = this.logService.users[this.index];
    this.Data.name = user.name || '';
    this.Data.id = user.uid;
  }

  httpPost(contactForm: NgForm) {
    this.http.post(this.post.endPoint, this.post.body(this.Data)).subscribe({
      next: (response) => {
        contactForm.resetForm();
      },
      error: (error: string) => {
        console.error(error);
      },
      complete: () => {            
        console.log('mail send');
      },
    });
  }

}
