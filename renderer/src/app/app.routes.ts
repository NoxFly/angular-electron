import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'not-desktop',
        loadComponent: () => import('./views/not-desktop/not-desktop.component').then(c => c.NotDesktopComponent),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./views/home/home.component').then(c => c.HomeComponent),
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
    }
];
