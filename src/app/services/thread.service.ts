import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  increment,
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

  subThreadList(
    currentChannelId: string,
    currentMessageId: string,
    type: string,
  ) {
    const docRef = collection(
      this.firestore,
      type,
      currentChannelId,
      'messages',
      currentMessageId,
      'threads',
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
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      currentMessageId,
      'threads',
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
    currentUserId: string,
    type: string,
  ) {
    console.log('is this triggered?');
    console.log(currentChannelId);
    console.log(currentMessageId);
    const docRef = collection(
      this.firestore,
      type,
      currentChannelId,
      'messages',
      currentMessageId,
      'threads',
    );

    let data: Thread = {
      text: sentThread.text,
      image: sentThread.image,
      sentBy: currentUserId,
      sentAt: Timestamp.fromDate(new Date()),
      uid: '',
      messageUid: currentMessageId,

    };

    const querySnapshot = await addDoc(docRef, data);
    await setDoc(querySnapshot, { ...data, uid: querySnapshot.id });

    const docRef2 = doc(
      this.firestore,
      type,
      currentChannelId,
      'messages',
      currentMessageId,
    );

    await updateDoc(docRef2, {
      lastThreadReply: Timestamp.fromDate(new Date()),
      threadReplies: increment(1),
    });
  }

  async editThread(editThread: any, currentId: string, type: string) {
    const docRef = doc(
      this.firestore,
      type,
      currentId,
      'messages',
      editThread.messageUid,
      'threads',
      editThread.uid,
    );
    await updateDoc(docRef, editThread);
  }
}
