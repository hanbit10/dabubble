import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  where,
} from '@angular/fire/firestore';

import { UserProfile } from '../models/users';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  firestore: Firestore = inject(Firestore);
  currentUser: UserProfile = {
    address: {
      city: 'Köln',
      street: 'straße 22332',
    },
    email: 'chanbit10@gmail.com',
    name: 'Hanbit Chang',
    password: 'test123',
    profileImage: '',
    uid: 'id123123',
  };
  private channelSubject = new BehaviorSubject<any[]>([]);
  channels: any[] = [];
  constructor() {
    this.subChannelList();
  }

  async createNewChannel(newChannel: any, chosen: UserProfile[]) {
    let data = {
      name: newChannel.name,
      description: newChannel.description,
      usersIds: [this.currentUser.uid],
      users: [
        {
          displayName: this.currentUser.name,
        },
      ],
    };

    chosen.forEach((user: any) => {
      data.usersIds.push(user.uid);
      data.users.push({
        displayName: user.name,
      });
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
}
