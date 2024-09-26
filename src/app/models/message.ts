import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  text?: string;
  image?: string;
  sentBy?: string;
  sentAt: Timestamp;
  uid: string;
  lastThreadReply: Timestamp | null;
  reactions: Reaction[] | null;
}

export interface Reaction {
  emojiNative: '',
  users: string[],
  count: number
}
