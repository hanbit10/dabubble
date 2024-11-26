import { Component, HostListener } from '@angular/core';
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
import { UtilityService } from '../../services/utility.service';

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
  constructor(public logService: LoginCreateAccountService, public utilityService: UtilityService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.utilityService.innerWidth = event.target.innerWidth;
    this.setMobile();
  }

  ngOnInit() {
    this.utilityService.innerWidth = window.innerWidth;
    this.setMobile();
    if (this.utilityService.mobile) {
      this.introAnimationMobile();
    } else {
      this.introAnimation();
    }
  }

  setMobile() {
    if (this.utilityService.innerWidth <= 700) {
      this.utilityService.mobile = true;
    } else {
      this.utilityService.mobile = false;
    }
  }

  introAnimation() {
    const timeline = this.createTimeline();
    this.animateLogo(timeline, '2.5', '50%', '43%');
    this.animateTypewriter(timeline, '0');
    this.hideIntroScreen();
  }

  introAnimationMobile() {
    const timeline = this.createTimeline();
    this.animateLogo(timeline, '1.5', '40%', '35%');
    this.animateTypewriter(timeline, '0%');
    this.hideIntroScreen();
  }

  createTimeline() {
    const timeline = gsap.timeline();
    timeline.set('.typewriter', { color: 'white' });
    return timeline;
  }

  animateLogo(timeline: gsap.core.Timeline, scale: string, left1: string, left2: string) {
    timeline.fromTo(
      '.logocontainer',
      {
        scale: scale,
        position: 'absolute',
        left: left1,
        top: '45%',
        yPercent: 0,
      },
      { delay: 0.5, duration: 0.2, left: left2 }
    );
  }

  animateTypewriter(timeline: gsap.core.Timeline, left: string) {
    timeline.fromTo(
      '.typewriter',
      { x: '-100%' },
      { duration: 1, delay: 0.5, x: '0', ease: 'back.out' }
    )
      .to('.logocontainer', {
        duration: 1.2,
        delay: 0.3,
        left: left,
        top: '0',
        scale: 1,
        yPercent: 0,
        position: 'relative',
      });
    gsap.set('.typewriter', { delay: 3, color: 'black' });
  }

  hideIntroScreen() {
    gsap.to('.intro-screen', {
      duration: 1,
      opacity: 0,
      delay: 2.7,
      display: 'none',
    });
  }
}
