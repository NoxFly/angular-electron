import { Routes } from '@angular/router';

export const routes: Routes = [
    /* ------------------------- General ------------------------- */
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
    },
    /* ------------------------- Auth ------------------------- */
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
    },
    {
        path: 'logout',
        loadComponent: () => import('./logout/logout.component').then(c => c.LogoutComponent),
    },
    /* ------------------------- Settings ------------------------- */
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(c => c.routes),
    },
    /* ------------------------- Data & Main usage ------------------------- */
    {
        path: 'articles',
        loadComponent: () => import('./articles/list/article-list.component').then(c => c.ArticleListComponent),
    },
    {
        path: 'receipts',
        loadComponent: () => import('./receipts/list/receipt-list.component').then(c => c.ReceiptListComponent),
    },
    {
        path: 'receipt/:id',
        loadComponent: () => import('./receipts/board/receipt-board.component').then(c => c.ReceiptBoardComponent),
    },
    {
        path: 'contacts',
        loadComponent: () => import('./contacts/list/contact-list.component').then(c => c.ContactListComponent),
    },
    {
        path: 'contact/:id',
        loadComponent: () => import('./contacts/card/contact-card.component').then(c => c.ContactCardComponent),
    },
    {
        path: 'quotes',
        loadComponent: () => import('./quotes/list/quote-list.component').then(c => c.QuoteListComponent),
    }
];
