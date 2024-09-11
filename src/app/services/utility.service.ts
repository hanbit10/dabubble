import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  close(elementID: string) {
    const element = document.getElementById(elementID);
    element?.classList.add('hidden');
  }
}
