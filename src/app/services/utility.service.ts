import { Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  closeComponent(elementID: string) {
    const element = document.getElementById(elementID);
    element?.classList.add('hidden');
  }

  openComponent(elementID: string) {
    const element = document.getElementById(elementID);
    element?.classList.remove('hidden');
  }

  getFormattedTime(currDate: Timestamp | null) {
    if (!currDate) return;
    const date: Date | undefined = currDate.toDate();
    const validDate = new Date(date ?? new Date());
    const formatTime = validDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatTime;
  }
}
