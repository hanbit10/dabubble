import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ChannelNavComponent } from '../../components/channel-nav/channel-nav.component';
import { ChannelCreateComponent } from '../../components/channel-create/channel-create.component';
import { DirectNavComponent } from '../../components/direct-nav/direct-nav.component';
import { ProfileService } from '../../services/profile.service';
import { ProfileUserComponent } from '../../components/profile-user/profile-user.component';
import { ThreadComponent } from '../../components/thread/thread.component';
import { ChannelService } from '../../services/channel.service';
import { ThreadService } from '../../services/thread.service';
import { ProfileEditPictureComponent } from '../../components/profile-edit-picture/profile-edit-picture.component';
import { UtilityService } from '../../services/utility.service';

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
    ProfileUserComponent,
    ThreadComponent,
    ProfileEditPictureComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  menuOpen = true;

  constructor(
    public profileService: ProfileService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public utilityService: UtilityService
  ) {}
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.utilityService.innerWidth = event.target.innerWidth;
    this.openCloseMainChat();
  }

  ngOnInit(): void {
    this.utilityService.innerWidth = window.innerWidth;
    this.openCloseMainChat();
  }

  openCloseMainChat(){
    let chat = document.getElementById('main-chat-container');
    
    if (this.utilityService.innerWidth < 1000) {
      if (this.threadService.threadIsOpen){
        chat?.classList.add('hidden');
      }else{
        chat?.classList.remove('hidden');
      }
    }else{
      chat?.classList.remove('hidden');
    }
  }

  toggleMenu() {
    if (this.menuOpen) {
      this.menuOpen = false;
    } else {
      this.menuOpen = true;
    }
  }
}
