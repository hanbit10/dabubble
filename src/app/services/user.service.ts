import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, setDoc } from '@angular/fire/firestore';

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
  constructor() {}

  async addUser() {
    const docRef = collection(this.firestore, 'users');
    const querySnapshot = await addDoc(docRef, this.data);
    await setDoc(querySnapshot, { ...this.data, uid: querySnapshot.id });
  }
}
