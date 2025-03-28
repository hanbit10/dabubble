import { ElementRef, Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  innerWidth: any;
  mobile = false;
  menuIsOpen: boolean = true;

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

  formatDate(dateString: Date | undefined): string {
    const validDate = new Date(dateString ?? new Date());
    const today = new Date();
    const isToday = validDate.toDateString() === today.toDateString();
    if (isToday) {
      return 'Heute';
    } else {
      return validDate.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
  }

  lastSeenDay: string | null = new Date().toDateString();
  shouldShowTimestamp(message: any): boolean {
    if (!message || !message.sentAt || !message.sentAt.toDate) {
      return false;
    }
    const messageDay = new Date(message.sentAt.toDate()).toDateString();
    const shouldShow = this.lastSeenDay !== messageDay;
    this.lastSeenDay = messageDay;
    return shouldShow;
  }

  getAntwort(number: number): string {
    if (number === 1) {
      return 'Antwort';
    } else {
      return 'Antworten';
    }
  }

  unsubscribe(subscriptions: Subscription[]) {
    subscriptions.forEach(
      (subscription) => subscription && subscription.unsubscribe(),
    );
  }

  getIdByParam(paramap: ParamMap, typeId: string) {
    const paramId = paramap.get(typeId);
    if (paramId) {
      return paramId;
    } else {
      return '';
    }
  }

  sortedArray(arr: any[]): any[] {
    return arr.sort((a, b) => {
      if (a.sentAt && b.sentAt) {
        return a.sentAt.toDate().getTime() - b.sentAt.toDate().getTime();
      }
      return 0;
    });
  }

  scrollToBottom(element: ElementRef): void {
    setTimeout(() => {
      if (element) {
        element.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }
  /**
   * When opening the channel this adjusts the layout for mobile view if necessary.
   */
  openChannel() {
    if (this.mobile) {
      this.closeComponent('main-menu');
      this.menuIsOpen = false;
      this.openComponent('main-chat-container');
    }
  }

  checkChannels(type: string, threadActive: boolean) {
    return (
      type == 'channels' && (threadActive == true || threadActive == false)
    );
  }

  checkChats(type: string, threadActive: boolean) {
    return type == 'chats' && (threadActive == true || threadActive == false);
  }
}
