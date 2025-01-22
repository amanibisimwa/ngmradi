import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
// Register French locale
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withPreloading(PreloadAllModules)
    ),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ngmradi-tuto',
        appId: '1:97516357873:web:0bfc70985b1be797220150',
        storageBucket: 'ngmradi-tuto.firebasestorage.app',
        apiKey: 'AIzaSyAuWDZcrK8q7sAepzTcxO4WSG-HZT2SOGA',
        authDomain: 'ngmradi-tuto.firebaseapp.com',
        messagingSenderId: '97516357873',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    ),
  ],
};
