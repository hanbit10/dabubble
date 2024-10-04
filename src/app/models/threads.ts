import { Timestamp } from '@angular/fire/firestore';

export interface Thread {
  text?: string;
  image?: string;
  sentBy?: string;
  sentAt: Timestamp;
  uid: string;
  messageUid: string;
}
