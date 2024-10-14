import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Channel } from '../models/channels';

import { UserProfile } from '../models/users';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  firestore: Firestore = inject(Firestore);
  private channelSubject = new BehaviorSubject<any[]>([]);
  private channelByIdSubject = new BehaviorSubject<any>({} as Channel);
  channels: any[] = [];
  channelById: any = {} as Channel;
  channelIsOpen: boolean = true;

  constructor(public utilityService: UtilityService) {
    this.subChannelList();
  }

  async createNewChannel(
    newChannel: any,
    chosen: UserProfile[],
    currentUserId: string,
  ) {
    let data: Channel = {
      name: newChannel.name,
      description: newChannel.description,
      usersIds: [currentUserId],
      uid: '',
      createdBy: currentUserId,
      createdAt: Timestamp.fromDate(new Date()),
    };

    chosen.forEach((user: any) => {
      data.usersIds.push(user.uid);
    });

    const ref = collection(this.firestore, 'channels');
    const querySnapshot = await addDoc(ref, data);
    const uid = querySnapshot.id;
    await setDoc(querySnapshot, { ...data, uid });
    alert('channel created');
  }

  get channels$() {
    return this.channelSubject.asObservable();
  }

  get channelById$() {
    return this.channelByIdSubject.asObservable();
  }

  subChannelList() {
    const docRef = collection(this.firestore, 'channels');
    return onSnapshot(docRef, (list) => {
      this.channels = [];
      list.forEach((doc) => {
        this.channels.push(doc.data());
      });
      console.log(this.channels);
      this.channelSubject.next(this.channels);
    });
  }

  subChannelById(currentChannelId: string) {
    const docRef = doc(this.firestore, 'channels', currentChannelId);
    return onSnapshot(docRef, (doc) => {
      this.channelById = doc.data();
      this.channelByIdSubject.next(this.channelById);
    });
  }

  async addUser(currChannelID: string, selectedUsers: UserProfile[]) {
    const docRef = doc(this.firestore, 'channels', currChannelID);
    selectedUsers.forEach(async (user) => {
      await updateDoc(docRef, {
        usersIds: arrayUnion(user.uid),
      });
    });
  }

  updateChannel(uid: string, type: string, data: any) {
    console.log(data);
    if (type == 'name') {
      const docRef = doc(this.firestore, 'channels', uid);
      updateDoc(docRef, {
        name: data.name,
      });
    } else if (type == 'description') {
      const docRef = doc(this.firestore, 'channels', uid);
      updateDoc(docRef, {
        description: data.description,
      });
    }
  }

  leaveChannel(uid: string, currentUserId: string) {
    const docRef = doc(this.firestore, 'channels', uid);
    updateDoc(docRef, {
      usersIds: arrayRemove(currentUserId),
    });
  }

  /**
   * Opens the channel and adjusts the layout for mobile view if necessary.
   */
  openChannel(){
    this.channelIsOpen = true;
    if (this.utilityService.mobile) {
      this.utilityService.closeComponent('main-menu');
      this.utilityService.menuIsOpen = false;
      this.utilityService.openComponent('main-chat-container');
    }

  getChannels(channels: Channel[]) {
    const allChannels: Channel[] = [];
    channels.forEach((channel) => {
      if (channel) {
        allChannels.push(channel);
      }
    });
    return allChannels;
  }
}
