import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  threadIsOpen: boolean = false;

  constructor() {}

  openThread() {
    this.threadIsOpen = true;
  }

  closeThread() {
    this.threadIsOpen = false;
  }
}
