import { Routes } from '@angular/router';
import { AppGuard } from './core/guards/app.guard';
import { RegisteredGuard } from './core/guards/registered.guard';
import { UnregisteredGuard } from './core/guards/unregistered.guard';

export const routes: Routes = [
    {
        path: 'not-desktop',
        loadComponent: () => import('./views/not-desktop/not-desktop.component').then(c => c.NotDesktopComponent),
    },
    {
        path: 'dashboard',
        canActivate: [AppGuard, RegisteredGuard],
        runGuardsAndResolvers: 'always',
        loadChildren: () => import('./views/dashboard/dashboard.routes').then(r => r.routes),
    },
    {
        path: 'register',
        canActivate: [AppGuard, UnregisteredGuard],
        runGuardsAndResolvers: 'always',
        loadComponent: () => import('./views/register/register.component').then(c => c.RegisterComponent),
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }
];
