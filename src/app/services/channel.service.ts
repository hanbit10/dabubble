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
    color: '#000000',
    displayName: 'Hanbit',
    email: 'chanbit10@gmail.com',
    name: {
      firstName: 'Hanbit',
      lastName: 'Chang',
    },
    password: 'test123',
    profileImage: '',
    uid: 'id123123',
    mainUser: false,
  };
  constructor() {}

  async createNewChannel(newChannel: any, chosen: UserProfile[]) {
    let data = {
      name: newChannel.name,
      description: newChannel.description,
      usersIds: [this.currentUser.uid],
      users: [
        {
          displayName: this.currentUser.name.firstName,
        },
      ],
    };

    chosen.forEach((user: any) => {
      data.usersIds.push(user.uid);
      data.users.push({
        displayName: user.name.firstName,
      });
    });

    const ref = collection(this.firestore, 'channels');
    const querySnapshot = await addDoc(ref, data);
    const uid = querySnapshot.id;
    await setDoc(querySnapshot, { ...data, uid });
    alert('channel created');
  }
}
