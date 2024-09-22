import { Timestamp } from '@angular/fire/firestore';

export interface Channel {
  name: string;
  description: string;
  uid: string;
  usersIds: string[];
  createdBy: string;
  createdAt?: Timestamp;
}
