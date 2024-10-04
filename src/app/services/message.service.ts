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
    console.log('subscribe message List', currentChannelId, type);
    return onSnapshot(docRef, (list) => {
      this.messages = [];
      list.forEach((doc) => {
        this.messages.push(doc.data());
      });
      console.log('subscribed messages', this.messages);
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
      threadReplies: 0,
      reactions: null,
    };

    const querySnapshot = await addDoc(docRef, data);
    await setDoc(querySnapshot, { ...data, uid: querySnapshot.id });
  }

  async editMessage(editMessage: any, currentChannelId: string, type: string) {
    const docRef = doc(
      this.firestore,
      type,
      currentChannelId,
      'messages',
      editMessage.uid,
    );
    await updateDoc(docRef, editMessage);
  }

  /**
   * Updates excisting reactions or creates new ones when adding a reaction to a message.
   *
   * @param {string} emoji - the emoji that is given as reaction
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   * @param {any} message - the message to which the reaction is added
   * @param {string} channelId - the Id of the channel where the message is written
   */
  giveReaction(
    emoji: string,
    currentUser: any,
    message: any,
    channelId: string,
  ) {
    console.log(emoji);

    this.reactionExists = false;
    if (message.reactions) {
      this.checkReaction(emoji, currentUser, message, channelId);
      if (!this.reactionExists) {
        this.addReactionToArray(emoji, currentUser, message);
      }
    } else {
      this.createReactions(emoji, currentUser, message);
    }
    this.updateMessage(`channels/${channelId}/messages`, message.uid, message);
  }

  /**
   * Checks if an emoji already exists as reaction for a message.
   *
   * @param {string} emoji - the emoji that is given as reaction
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   * @param {any} message - the message to which the reaction is added
   * @param {string} channelId - the Id of the channel where the message is written
   */
  checkReaction(
    emoji: string,
    currentUser: any,
    message: any,
    channelId: string,
  ) {
    for (let i = 0; i < message.reactions.length; i++) {
      let reaction = message.reactions[i];
      if (reaction.emojiNative == emoji) {
        this.handleSingleReaction(reaction, currentUser, message, channelId, i);
        this.reactionExists = true;
        break;
        break;
      }
    }
  }

  /**
   * Handles adding and removing a reaction and updating the message.
   *
   * @param {any} reaction - single reaction to a message
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   * @param {any} message - the message to which the reaction is added
   * @param {string} channelId - the Id of the channel where the message is written
   * @param {number} i - position of the reaction in the reaction Array
   */
  handleSingleReaction(
    reaction: any,
    currentUser: any,
    message: any,
    channelId: string,
    i: number,
  ) {
    console.log(currentUser);

    if (reaction.users.includes(currentUser)) {
      this.removeReaction(reaction, currentUser, message, i);
    } else {
      this.addReaction(reaction, currentUser);
    }
    this.updateMessage(`channels/${channelId}/messages`, message.uid, message);
  }

  /**
   * Removes an already existing reaction.
   *
   * @param {any} reaction - single reaction to a message
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   * @param {any} message - the message to which the reaction is added
   * @param {number} i - position of the reaction in the reaction Array
   */
  removeReaction(reaction: any, currentUser: any, message: any, i: number) {
    reaction.count--;
    let indexOfUser = reaction.users.indexOf(currentUser);

    if (indexOfUser > -1) {
      reaction.users.splice(indexOfUser, 1);
    }
    if (reaction.count == 0) {
      message.reactions.splice(i, 1);
    }
  }

  /**
   * Increases the count of an reaction and adds the user.
   *
   * @param {any} reaction - single reaction to a message
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   */
  addReaction(reaction: any, currentUser: any) {
    reaction.count++;
    reaction.users.push(currentUser);
  }

  /**
   *
   * Adds a new reaction to the reactions Array of a message.
   *
   * @param {string} emoji - the emoji that is given as reaction
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   * @param {any} message - the message to which the reaction is added
   */
  addReactionToArray(emoji: string, currentUser: any, message: any) {
    message.reactions.push({
      emojiNative: emoji,
      count: 1,
      users: [currentUser],
    });
  }

  /**
   * When the reactions Array of a message is null this adds the first reaction.
   *
   * @param {string} emoji - the emoji that is given as reaction
   * @param {any} currentUser - the user that is logged in and is giving the reaction
   * @param {any} message - the message to which the reaction is added
   */
  createReactions(emoji: string, currentUser: any, message: any) {
    message.reactions = [
      {
        emojiNative: emoji,
        count: 1,
        users: [currentUser],
      },
    ];
  }

  /**
   *  Updates a document in the specified collection with the provided item.
   *
   * @param {string} col - the Id of the collection where the document is located
   * @param {string} docId - the Id of the document that will be updated
   * @param {object} item - the new object to update the document with
   */
  async updateMessage(col: string, docId: string, item: {}) {
    await updateDoc(this.getSingleDocRef(col, docId), item)
      .catch((err) => {
        console.log(err);
      })
      .then();
  }

  /**
   * Retrieves a reference to a single document within a collection in Firestore.
   *
   * @param {string} col - the Id of the collection where the document is located
   * @param {string} docId - the Id of the document that will be updated
   * @returns {DocumentReference} - A Firestore document reference object for the specified document.
   */
  getSingleDocRef(col: string, docId: string) {
    return doc(collection(this.firestore, col), docId);
  }
}
