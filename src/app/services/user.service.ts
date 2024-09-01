import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
} from '@angular/fire/firestore';

import { UserProfile } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore: Firestore = inject(Firestore);
  data = {
    address: {
      city: 'Köln',
      street: 'straße 2',
    },
    color: '#000000',
    displayName: 'Tester',
    email: 'test@gmail.com',
    name: {
      firstName: 'tester',
      lastName: 'testing',
    },
    password: 'test123',
    profileImage: '',
    uid: '',
  };
  allUsers: UserProfile[] = [];
  constructor() {}

  async addUser() {
    const docRef = collection(this.firestore, 'users');
    const querySnapshot = await addDoc(docRef, this.data);
    await setDoc(querySnapshot, { ...this.data, uid: querySnapshot.id });
  }

  async getAllUsers() {
    // const docRef = collection(this.firestore, 'users');
    // const querySnapshot = await getDocs(docRef);
    // querySnapshot.forEach((doc) => {
    //   const userData = doc.data() as UserProfile;
    //   this.allUsers.push(userData);
    // });
    const docRef = collection(this.firestore, 'users');
    const querySnapshots = onSnapshot(docRef, (querySnapshot) => {
      this.allUsers = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;
        this.allUsers.push(userData);
      });
    });
    console.log(this.allUsers);
  }

  async updateUser(user: {}, userId: string){
    const userRef = doc(collection(this.firestore, 'users'), userId);
    await updateDoc(userRef, user);
  }


}
