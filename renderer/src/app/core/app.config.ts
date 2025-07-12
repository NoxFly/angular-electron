import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from 'src/app/app.routes';
import { ElectronService } from 'src/app/core/services/electron.service';
import { GlobalStateService } from './services/globalState.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withViewTransitions()),
        provideAnimations(),

        GlobalStateService,
        ElectronService,
    ]
};
