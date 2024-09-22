import { Injectable } from '@angular/core';

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
}
