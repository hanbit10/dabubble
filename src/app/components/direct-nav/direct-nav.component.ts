import { Component, inject, Inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';

@Component({
  selector: 'app-direct-nav',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './direct-nav.component.html',
  styleUrl: './direct-nav.component.scss',
})
export class DirectNavComponent {
  firestore: Firestore = inject(Firestore);
  public usersSubscription!: Subscription;
  allUsers: UserProfile[] = [];
  dropdown: boolean = true;

  constructor(public userService: UserService) {}

  async ngOnInit() {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
    });
  }


}
