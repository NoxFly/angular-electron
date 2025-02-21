import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
    },
    {
        path: 'logout',
        loadComponent: () => import('./logout/logout.component').then(c => c.LogoutComponent),
    },
    {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent),
    },
];
