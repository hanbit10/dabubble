import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { DirectChat } from '../models/direct-chat';

@Injectable({
  providedIn: 'root',
})
export class DirectChatService {
  firestore: Firestore = inject(Firestore);
  constructor() {}

  async createNewChat(otherUserId: string, currentUserId: string) {
    let data: DirectChat = {
      usersIds: [otherUserId, currentUserId],
      uid: '',
      createdAt: Timestamp.fromDate(new Date()),
    };

    const docRef = collection(this.firestore, 'chats');
    const querySnapshot = await addDoc(docRef, data);
    const uid = querySnapshot.id;
    await setDoc(querySnapshot, { ...data, uid });
  }

  async isExistingChat(otherUserId: string, currentUserId: string) {
    let found = false;
    const docRef = collection(this.firestore, 'chats');
    const q = query(docRef, where('usersIds', 'array-contains', currentUserId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (
        otherUserId == currentUserId &&
        doc.data()['usersIds'][0] == otherUserId &&
        doc.data()['usersIds'][1] == currentUserId
      ) {
        found = true;
        return;
      } else if (
        (doc.data()['usersIds'][0] == otherUserId &&
          doc.data()['usersIds'][1] == currentUserId) ||
        (doc.data()['usersIds'][0] == currentUserId &&
          doc.data()['usersIds'][1] == otherUserId)
      ) {
        found = true;
        return;
      }
    });
    return found;
  }

  async getChatId(otherUserId: string, currentUserId: string) {
    const docRef = collection(this.firestore, 'chats');
    const q = query(docRef, where('usersIds', 'array-contains', currentUserId));
    const querySnapshot = await getDocs(q);
    let chatId: string = '';
    querySnapshot.forEach((doc) => {
      if (
        otherUserId == currentUserId &&
        doc.data()['usersIds'][0] == otherUserId &&
        doc.data()['usersIds'][1] == currentUserId
      ) {
        chatId = doc.id;
        return;
      } else if (
        (doc.data()['usersIds'][0] == otherUserId &&
          doc.data()['usersIds'][1] == currentUserId) ||
        (doc.data()['usersIds'][0] == currentUserId &&
          doc.data()['usersIds'][1] == otherUserId)
      ) {
        chatId = doc.id;
        return;
      }
    });
    return chatId;
  }

  findMyChat(otherUserId: string, currentUserId: string, doc: any) {
    return (
      otherUserId == currentUserId &&
      doc.data()['usersIds'][0] == otherUserId &&
      doc.data()['usersIds'][1] == currentUserId
    );
  }
}
