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
        apiKey: 'AIzaSyBBLDiFkaligcwoZmBjASA60kC96CS6JgM',
        authDomain: 'dabubble-81102.firebaseapp.com',
        projectId: 'dabubble-81102',
        storageBucket: 'dabubble-81102.appspot.com',
        messagingSenderId: '191099366009',
        appId: '1:191099366009:web:35207ab505bf27692502a8',

        /* projectId: 'dabubble-8ac86',
        appId: '1:337899266017:web:75fb574256bd45adaafca0',
        storageBucket: 'dabubble-8ac86.appspot.com',
        apiKey: 'AIzaSyD6OgtifkKQS_VvwVo5dBJiZvODtkVWT88',
        authDomain: 'dabubble-8ac86.firebaseapp.com',
        messagingSenderId: '337899266017',
        measurementId: 'G-Q5C2333R0G', */
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
