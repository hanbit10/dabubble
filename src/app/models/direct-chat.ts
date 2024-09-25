import { Timestamp } from '@angular/fire/firestore';

export interface DirectChat {
  uid: string;
  usersIds: string[];
  createdAt?: Timestamp;
}
