import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  onSnapshot,
  Timestamp,
} from '@angular/fire/firestore';
import { Message } from '../models/message';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  firestore: Firestore = inject(Firestore);
  private messageSubject = new BehaviorSubject<any[]>([]);
  currentChannelId: string = '';
  messages: any[] = [];
  constructor() { }

  get messages$() {
    return this.messageSubject.asObservable();
  }

  subMessageList(currentChannelId: string) {
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages'
    );
    return onSnapshot(docRef, (list) => {
      this.messages = [];
      list.forEach((doc) => {
        this.messages.push(doc.data());
      });
      this.messageSubject.next(this.messages);
    });
  }

  async sendMessage(
    sentMessage: any,
    currentChannelId: string,
    currentUserId: string
  ) {
    const docRef = collection(
      this.firestore,
      'channels',
      currentChannelId,
      'messages'
    );

    let data: Message = {
      text: sentMessage.text,
      sentBy: currentUserId,
      sentAt: Timestamp.fromDate(new Date()),
    };

    const querySnapshot = await addDoc(docRef, data);
  }
}
