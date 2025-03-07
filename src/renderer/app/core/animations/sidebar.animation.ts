import { animate, state, style, transition, trigger } from "@angular/animations";

export const sidebarAnimation = trigger('slideInOut', [
    state('void', style({ width: '0px' })),
    state('*', style({ width: '80px' })),
    transition(':enter', [
        animate('300ms 300ms ease-in-out')
    ]),
    transition(':leave', [
        animate('300ms ease-in-out')
    ])
]);
