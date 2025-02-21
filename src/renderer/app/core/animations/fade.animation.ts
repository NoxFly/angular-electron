import { trigger, state, style, transition, animate, query, group } from "@angular/animations";

export const fadeInOutAnimation = trigger('fadeInOut', [
    state('void', style({ opacity: 0 })),
    state('*', style({ opacity: 1 })),

    transition(':enter', [
        query('.zoom-effect', [
            style({ opacity: 0, transform: 'scale(0.7)' }),
        ], { optional: true }),
        group([
            animate('300ms ease-in-out'),
            query('.zoom-effect', [
                animate('300ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
            ], { optional: true })
        ])
    ]),
    transition(':leave', [
        query('.zoom-effect', [
            style({ opacity: 1, transform: 'scale(1)' }),
        ], { optional: true }),
        group([
            animate('300ms ease-in-out'),
            query('.zoom-effect', [
                animate('300ms ease-in-out', style({ opacity: 0, transform: 'scale(1.3)' }))
            ], { optional: true })
        ])
    ]),
]);
