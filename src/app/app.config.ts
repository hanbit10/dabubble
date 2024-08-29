import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dabubble-8ac86',
        appId: '1:337899266017:web:75fb574256bd45adaafca0',
        storageBucket: 'dabubble-8ac86.appspot.com',
        apiKey: 'AIzaSyD6OgtifkKQS_VvwVo5dBJiZvODtkVWT88',
        authDomain: 'dabubble-8ac86.firebaseapp.com',
        messagingSenderId: '337899266017',
        measurementId: 'G-Q5C2333R0G',
      })
    ),
    provideFirestore(() => getFirestore()), provideAnimationsAsync(),
  ],
};
