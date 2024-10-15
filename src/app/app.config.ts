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
        authDomain: 'dabubble-8ac86.firebaseapp.com',
        projectId: 'dabubble-8ac86',
        storageBucket: 'dabubble-8ac86.appspot.com',
        messagingSenderId: '191099366009',
        appId: '1:191099366009:web:35207ab505bf27692502a8',
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
