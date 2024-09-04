import { Component } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-account-card',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './create-account-card.component.html',
  styleUrl: './create-account-card.component.scss'
})
export class CreateAccountCardComponent {

  constructor (public logService: LoginCreateAccountService){}

onSubmit(ngForm: NgForm) {
}


}
