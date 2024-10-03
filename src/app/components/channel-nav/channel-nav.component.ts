import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/users';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { map, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ChannelService } from '../../services/channel.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
})
export class ChannelNavComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private routeSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.channelSubscription,
  ];
  allUsers: any[] = [];
  allChannels: any[] = [];
  currentUserId: string = '';
  filtering: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
  ) {}
  async ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.currentUserId = id;
      }
    });

    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
    });

    this.channelSubscription = this.channelService.channels$
      .pipe(
        map((channels) =>
          channels.filter((channel) =>
            channel.usersIds.includes(this.currentUserId),
          ),
        ),
      )
      .subscribe((filteredChannels) => {
        this.allChannels = [];
        filteredChannels.forEach((channel) => {
          if (channel) {
            this.allChannels.push(channel);
          }
        });
      });

    this.toogleDirectMessage();
  }
  openComponent(elementId: string) {
    this.utilityService.openComponent(elementId);
  }

  toogleDirectMessage() {
    if (isPlatformBrowser(this.platformId)) {
      const dropdownIcon = document.getElementById('dropdown-icon');
      const dropdownBtn = document.getElementById('dropdown-btn');
      if (dropdownBtn) {
        dropdownBtn.addEventListener('click', (event) => {
          if (dropdownIcon && this.filtering) {
            dropdownIcon.classList.add('rotate-down');
          }
          if (dropdownIcon && !this.filtering) {
            dropdownIcon.classList.remove('rotate-down');
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe(),
    );
  }
}
