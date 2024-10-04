import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogInCardComponent } from '../../components/log-in-card/log-in-card.component';
import { NgIf } from '@angular/common';
import { CreateAccountCardComponent } from '../../components/create-account-card/create-account-card.component';
import { LoginCreateAccountService } from '../../services/login-create-account.service';
import { CreateAvatarCardComponent } from '../../components/create-avatar-card/create-avatar-card.component';
import { PasswordMailCardComponent } from '../../components/password-mail-card/password-mail-card.component';
import { ReassignPasswordCardComponent } from '../../components/reassign-password-card/reassign-password-card.component';
import { gsap, SteppedEase } from 'gsap';
import { ImpressumCardComponent } from '../../components/impressum-card/impressum-card.component';
import { PolicyCardComponent } from '../../components/policy-card/policy-card.component';
import { SendMessageComponent } from '../../components/send-message/send-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    LogInCardComponent,
    NgIf,
    CreateAccountCardComponent,
    CreateAvatarCardComponent,
    PasswordMailCardComponent,
    ReassignPasswordCardComponent,
    ImpressumCardComponent,
    PolicyCardComponent,
    SendMessageComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(public logService: LoginCreateAccountService) {}

  ngOnInit() {
    this.introAnimation();
  }

  introAnimation() {
    const timeline = gsap.timeline();
    timeline
      .set('.typewriter', { color: 'white' })
      .fromTo(
        '.logocontainer',
        {
          scale: 2.5,
          position: 'absolute',
          left: '55%',
          top: '50%',
          yPercent: -50,
        },
        { delay: 0.5, duration: 0.2, left: '45%' },
      )
      .fromTo(
        '.typewriter',
        { x: '-100%' },
        { duration: 1, delay: 0.5, x: '0', ease: 'back.out' },
      )
      .to('.logocontainer', {
        duration: 1.2,
        delay: 0.3,
        left: '0',
        top: '0',
        scale: 1,
        yPercent: 0,
        position: 'relative',
      });
    gsap.set('.typewriter', { delay: 3, color: 'black' });
    gsap.to('.intro-screen', {
      duration: 1,
      opacity: 0,
      delay: 2.7,
      display: 'none',
    });
  }
}
