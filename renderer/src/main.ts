import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { appConfig } from 'src/app/core/app.config';
import { environment } from 'src/environments/environment';
import { enableProdMode } from '@angular/core';

if(environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
    .catch(console.error);
