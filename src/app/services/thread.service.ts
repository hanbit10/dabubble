import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Thread } from '../models/threads';

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

  async getAllThreads(currentChannelId: string, currentMessageId: string) {
    console.log('this is the problem');
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      currentMessageId,
      'threads'
    );

    const querySnapshot = await getDocs(docRef);
    const threads = querySnapshot.docs.map((doc) => doc.data());
    return threads;
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
    console.log('is this triggered?');
    console.log(currentChannelId);
    console.log(currentMessageId);
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      currentMessageId,
      'threads'
    );

    let data: Thread = {
      text: sentThread.text,
      sentBy: currentUserId,
      sentAt: Timestamp.fromDate(new Date()),
      uid: '',
    };

    const querySnapshot = await addDoc(docRef, data);
    await setDoc(querySnapshot, { ...data, uid: querySnapshot.id });

    const docRef2 = doc(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      currentMessageId
    );

    await updateDoc(docRef2, {
      lastThreadReply: Timestamp.fromDate(new Date()),
    });
  }
}
