import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Message } from '../models/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  firestore: Firestore = inject(Firestore);
  private threadSubject = new BehaviorSubject<any[]>([]);
  threadIsOpen: boolean = false;
  threads: any[] = [];
  constructor() {}

  get threads$() {
    return this.threadSubject.asObservable();
  }

  subThreadList(currentChannelId: string, currentMessageId: string) {
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      currentMessageId,
      'threads'
    );
    return onSnapshot(docRef, (list) => {
      this.threads = [];
      list.forEach((doc) => {
        this.threads.push(doc.data());
      });
      this.threadSubject.next(this.threads);
    });
  }
  openThread() {
    this.threadIsOpen = true;
  }

  closeThread() {
    this.threadIsOpen = false;
  }

  async sendThread(
    sentThread: any,
    currentChannelId: string,
    currentMessageId: string,
    currentUserId: string
  ) {
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      currentMessageId,
      'threads'
    );

    let data: Message = {
      text: sentThread.text,
      sentBy: currentUserId,
      sentAt: Timestamp.fromDate(new Date()),
      uid: '',
    };

    const querySnapshot = await addDoc(docRef, data);
    await setDoc(querySnapshot, { ...data, uid: querySnapshot.id });
  }
}
