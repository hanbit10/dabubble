import { Timestamp } from '@angular/fire/firestore';
import { UserProfile } from './users';

export interface Message {
  text?: string;
  image?: string;
  sentBy?: string;
  sentAt: Timestamp;
  uid: string;
  lastThreadReply: Timestamp | null;
  threadReplies: number; 
  reactions: Reaction[] | null;
}

export interface Reaction {
  emojiNative: '';
  users: UserProfile[];
  count: number;
}
