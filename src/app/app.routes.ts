import { Routes } from '@angular/router';
import { APP_NAME } from './app.constants';

import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  {
    path: 'login',
    title: `Connexion - ${APP_NAME}`,
    loadComponent: () => import('./pages/login/login.component'),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '',
    title: `${APP_NAME}`,
    loadComponent: () => import('./pages/home/home.component'),
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'projects',
        title: `Projets - ${APP_NAME}`,
        loadComponent: () => import('./pages/home/projects/projects.component'),
      },
      {
        path: 'contributors',
        title: `Contributeurs - ${APP_NAME}`,
        loadComponent: () =>
          import('./pages/home/contributors/contributors.component'),
        children: [
          {
            path: 'active',
            title: `Contributeurs actifs - ${APP_NAME}`,
            loadComponent: () =>
              import('./pages/home/contributors/active/active.component'),
          },
          {
            path: 'achived',
            title: `Contributeurs archivés - ${APP_NAME}`,
            loadComponent: () =>
              import('./pages/home/contributors/achieved/achieved.component'),
          },
          {
            path: '',
            redirectTo: 'active',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'project/:id',
    title: `Chargement du project... -${APP_NAME}`,
    loadComponent: () => import('./pages/projet/projet.component'),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: 'projects',
  },
];
