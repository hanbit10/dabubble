import { Component, inject, Inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserProfile } from '../../models/users';
import { DirectChatService } from '../../services/direct-chat.service';

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
  currentUserId: string = '';
  currentChatId: string = '';
  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public directChatService: DirectChatService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
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

  async createDirectMessage(otherUserId: string) {
    const exist = this.directChatService.isExistingChat(
      otherUserId,
      this.currentUserId
    );
    if ((await exist) == false) {
      this.directChatService.createNewChat(otherUserId, this.currentUserId);
      console.log('new chat created');
    } else {
      this.directChatService.getChatId(otherUserId, this.currentUserId);
      console.log('existing chat found');
    }
  }
}
