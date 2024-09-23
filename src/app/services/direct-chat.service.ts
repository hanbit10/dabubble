import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DirectChatService {
  constructor() {}

  getChatId(otherUserId: string, currentUserId: string) {}
}
