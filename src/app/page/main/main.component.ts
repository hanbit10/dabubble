import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ChannelNavComponent } from '../../components/channel-nav/channel-nav.component';
import { ChannelCreateComponent } from '../../components/channel-create/channel-create.component';
import { DirectNavComponent } from '../../components/direct-nav/direct-nav.component';
import { MessageUserService } from '../../services/message-user.service';
import { ProfileUserComponent } from '../../components/profile-user/profile-user.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    HeaderComponent,
    ChannelNavComponent,
    ChannelCreateComponent,
    DirectNavComponent,
    ProfileUserComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  menuOpen = true;

  constructor(public messageUserService: MessageUserService) {}

  ngOnInit(): void {

  }

  toggleMenu(){
    if (this.menuOpen) {
      this.menuOpen = false;
    }else{
      this.menuOpen = true;
    }
  }

}
