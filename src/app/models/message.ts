import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  text?: string;
  image?: string;
  sentBy?: string;
  sentAt?: Timestamp;
  reactions?: [{
    emojiNative: string;
    count: number;
    users: {};
  }]
}

export interface Reaction{
    emojiNative: string;
    count: number;
    reacted: boolean;
}
