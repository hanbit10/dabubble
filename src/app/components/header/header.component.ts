import { Component, Input } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ProfileMainComponent } from '../../profile-main/profile-main.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, RouterLink, ProfileMainComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  menuOpen = false;
  profileOpen = false;

  openMenu(){
    this.menuOpen = true;
  }

  closeMenu(){
    this.menuOpen = false;
  }

  openProfile(){
    this.profileOpen = true;
  }

  closeProfile(){
    this.profileOpen = false;
  }
 }
