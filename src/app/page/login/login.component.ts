import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import { LogInCardComponent } from '../../components/log-in-card/log-in-card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,MatInputModule,LogInCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
