import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { DirectChatService } from '../../services/direct-chat.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-direct-nav',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './direct-nav.component.html',
  styleUrl: './direct-nav.component.scss',
})
export class DirectNavComponent implements OnInit, OnDestroy {
  public usersSubscription!: Subscription;
  public routeSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.routeSubscription,
  ];
  allUsers: UserProfile[] = [];
  dropdown: boolean = true;
  currentUserId: string = '';
  currentChatId: string = '';
  constructor(
    public userService: UserService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
    public directChatService: DirectChatService,
  ) {}

  async ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        this.currentUserId = id;
        console.log('what is this id', id);
      }
    });

    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
    });
  }

  ngOnDestroy(): void {
    this.utilityService.unsubscribe(this.subscriptions);
  }
}
