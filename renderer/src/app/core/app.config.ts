import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { GlobalStateService } from './services/globalState.service';
import { ElectronService } from 'src/app/core/services/electron.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withViewTransitions()),
        provideAnimations(),

        GlobalStateService,
        ElectronService,
    ]
};
