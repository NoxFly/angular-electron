import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./settings.component').then(c => c.SettingsComponent),
    },
    {
        path: 'about',
        loadComponent: () => import('./about-settings/about-settings.component').then(c => c.AboutSettingsComponent),
    },
    {
        path: 'data',
        loadComponent: () => import('./data-settings/data-settings.component').then(c => c.DataSettingsComponent),
    },
    {
        path: 'cash',
        loadComponent: () => import('./cash-settings/cash-settings.component').then(c => c.CashSettingsComponent),
    },
    {
        path: 'preferences',
        loadComponent: () => import('./preferences-settings/preferences-settings.component').then(c => c.PreferencesSettingsComponent),
    },
];
