import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  text?: string;
  image?: string;
  sentBy?: string;
  sentAt: Timestamp;
}
