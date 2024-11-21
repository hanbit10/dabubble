import { Component, OnInit } from '@angular/core';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { ReassignPasswordCardComponent } from '../../components/reassign-password-card/reassign-password-card.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReassignPasswordCardComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  id = '';
  constructor(
    public logService: LoginCreateAccountService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.router.navigateByUrl(`/${this.id}`);
  }
}
