import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { UserProfile } from '../../models/users';
import { map, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ChannelService } from '../../services/channel.service';
import { UtilityService } from '../../services/utility.service';
import { Channel } from '../../models/channels';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-channel-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './channel-nav.component.html',
  styleUrl: './channel-nav.component.scss',
})
export class ChannelNavComponent implements OnInit {
  private usersSubscription!: Subscription;
  private channelSubscription!: Subscription;
  private routeSubscription!: Subscription;
  subscriptions: Subscription[] = [
    this.usersSubscription,
    this.channelSubscription,
    this.routeSubscription,
  ];
  allUsers: UserProfile[] = [];
  allChannels: Channel[] = [];
  currentUserId: string = '';
  filtering: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public userService: UserService,
    public channelService: ChannelService,
    public utilityService: UtilityService,
    private route: ActivatedRoute,
    public threadService: ThreadService
  ) {}

  async ngOnInit() {
    this.getCurrentUserId();
    this.getAllUsers();
    this.getCurrentUserChannel();
    this.toogleDirectMessage();
  }

  getCurrentUserId() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.currentUserId = this.utilityService.getIdByParam(params, 'id');
    });
  }

  getAllUsers() {
    this.usersSubscription = this.userService.users$.subscribe((users) => {
      this.allUsers = users;
    });
  }

  getCurrentUserChannel() {
    this.channelSubscription = this.channelService.channels$
      .pipe(
        map((channels) =>
          channels.filter((channel) =>
            channel.usersIds.includes(this.currentUserId),
          ),
        ),
      )
      .subscribe((filteredChannels) => {
        this.allChannels = this.channelService.getChannels(filteredChannels);
      });
  }

  openComponent(elementId: string) {
    this.utilityService.openComponent(elementId);
  }

  toogleDirectMessage() {
    if (isPlatformBrowser(this.platformId)) {
      const dropdownIcon = document.getElementById('dropdown-icon');
      const dropdownBtn = document.getElementById('dropdown-btn');
      if (dropdownBtn && dropdownIcon) {
        this.onClick(dropdownBtn, dropdownIcon);
      }
    }
  }

  onClick(dropdownBtn: HTMLElement, dropdownIcon: HTMLElement) {
    dropdownBtn.addEventListener('click', (event) => {
      if (dropdownIcon && this.filtering) {
        dropdownIcon.classList.add('rotate-down');
      }
      if (dropdownIcon && !this.filtering) {
        dropdownIcon.classList.remove('rotate-down');
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe(),
    );
  }

  openChannel(){
    this.channelService.channelIsOpen = true;
    this.utilityService.openChannel();
    this.threadService.closeThread();
  }
}
