import { inject, Injectable } from '@angular/core';
import {
  addDoc,
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
@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  firestore: Firestore = inject(Firestore);
  private channelSubject = new BehaviorSubject<any[]>([]);
  channels: any[] = [];
  threadIsOpen: boolean = false;

  constructor() {
    this.subChannelList();
  }

  async createNewChannel(
    newChannel: any,
    chosen: UserProfile[],
    currentUserId: string
  ) {
    let data: Channel = {
      name: newChannel.name,
      description: newChannel.description,
      usersIds: [currentUserId],
      uid: '',
      createdBy: currentUserId,
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

  subChannelList() {
    const docRef = collection(this.firestore, 'channels');
    return onSnapshot(docRef, (list) => {
      this.channels = [];
      list.forEach((doc) => {
        this.channels.push(doc.data());
      });
      this.channelSubject.next(this.channels);
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

  openThread(){
    this.threadIsOpen = true;
  }

  closeThread(){
    this.threadIsOpen = false;
  }
}
