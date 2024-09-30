import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Message, Reaction } from '../models/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  firestore: Firestore = inject(Firestore);
  private messageSubject = new BehaviorSubject<any[]>([]);
  private messageByIdSubject = new BehaviorSubject<any>({});
  currentChannelId: string = '';
  messages: any[] = [];
  messageById: any = {} as Message;
  reactionExists = false;
  messageFileURL: string = '';

  constructor() {}

  get messages$() {
    return this.messageSubject.asObservable();
  }

  get messageById$() {
    return this.messageByIdSubject.asObservable();
  }

  subMessageById(currentChannelId: string, curentMessage: string) {
    const docRef = doc(
      this.firestore,
      'channels',
      currentChannelId,
      'messages',
      curentMessage,
    );

    return onSnapshot(docRef, (doc) => {
      this.messageById = doc.data();
      this.messageByIdSubject.next(this.messageById);
    });
  }

  subMessageList(currentChannelId: string, type: string) {
    const docRef = collection(
      this.firestore,
      type,
      currentChannelId,
      'messages',
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
    currentUserId: string,
    type: string,
  ) {
    const docRef = collection(
      this.firestore,
      type,
      currentChannelId,
      'messages',
    );

    let data: Message = {
      image: sentMessage.image,
      text: sentMessage.text,
      sentBy: currentUserId,
      sentAt: Timestamp.fromDate(new Date()),
      uid: '',
      lastThreadReply: null,
      reactions: null,
    };

    const querySnapshot = await addDoc(docRef, data);
    await setDoc(querySnapshot, { ...data, uid: querySnapshot.id });
  }

  giveReaction(event: any, currentUser: any, message: any, channelId: any) {
    this.reactionExists = false;
    if (message.reactions) {
      this.handleReaction(event, currentUser, message, channelId);
      if (!this.reactionExists) {
        this.addReactionToArray(event, currentUser, message);
      }
    } else {
      this.createReactions(event, currentUser, message);
    }
    this.updateMessage(`channels/${channelId}/messages`, message.uid, message);
  }

  handleReaction(event: any, currentUser: any, message: any, channelId: any) {
    for (let i = 0; i < message.reactions.length; i++) {
      let reaction = message.reactions[i];
      if (reaction.emojiNative == event.emoji.native) {
        if (reaction.users.includes(currentUser)) {
          this.removeReaction(reaction, currentUser, message, i);
        } else {
          this.addReaction(reaction, currentUser);
        }
        this.updateMessage(
          `channels/${channelId}/messages`,
          message.uid,
          message,
        );
        this.reactionExists = true;
        break;
      }
    }
  }

  removeReaction(reaction: any, currentUser: any, message: any, i: any) {
    reaction.count--;
    reaction.users.splice(currentUser, 1);
    if (reaction.count == 0) {
      message.reactions.splice(i, 1);
    }
  }

  addReaction(reaction: any, currentUser: any) {
    reaction.count++;
    reaction.users.push(currentUser);
  }

  addReactionToArray(event: any, currentUser: any, message: any) {
    message.reactions.push({
      emojiNative: event.emoji.native,
      count: 1,
      users: [currentUser],
    });
  }

  createReactions(event: any, currentUser: any, message: any) {
    message.reactions = [
      {
        emojiNative: event.emoji.native,
        count: 1,
        users: [currentUser],
      },
    ];
  }

  async updateMessage(col: string, docId: string, item: {}) {
    await updateDoc(this.getSingleDocRef(col, docId), item)
      .catch((err) => {
        console.log(err);
      })
      .then();
  }

  getSingleDocRef(col: string, docId: string) {
    return doc(collection(this.firestore, col), docId);
  }
}
