import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../../components/header/header.component';
import { ChannelNavComponent } from '../../components/channel-nav/channel-nav.component';
import { ChannelCreateComponent } from '../../components/channel-create/channel-create.component';
import { DirectNavComponent } from '../../components/direct-nav/direct-nav.component';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    HeaderComponent,
    ChannelNavComponent,
    ChannelCreateComponent,
    DirectNavComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService
  ) {}
  ngOnInit(): void {
    const allUsers: Promise<UserProfile[]> = this.userService.getAllUsers();
    allUsers.then((users) => {
      console.log('users', users);
    });
  }

  addUser() {
    this.userService.addUser();
  }
}
