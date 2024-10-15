import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { IMAGE_CONFIG } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyD6OgtifkKQS_VvwVo5dBJiZvODtkVWT88',
        authDomain: 'dabubble-8ac86.firebaseapp.com',
        projectId: 'dabubble-8ac86',
        storageBucket: 'dabubble-8ac86.appspot.com',
        messagingSenderId: '337899266017',
        appId: '1:337899266017:web:75fb574256bd45adaafca0',
        measurementId: 'G-Q5C2333R0G',
      }),
    ),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
  ],
};
