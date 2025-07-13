import 'reflect-metadata';
import 'core/environment';
import { bootstrapApplication } from 'engine/bootstrap';
import { Application } from 'modules/app.service';
import { AppModule } from 'modules/app.module';
import { RootInjector } from 'engine/app-injector';
import { Router } from 'engine/router';
import { Request } from 'engine/request';
import { Logger } from 'engine/logger';

async function main(): Promise<void> {
    const application = await bootstrapApplication(Application, AppModule);

    const router = RootInjector.resolve(Router);
    
    const request = new Request(application, { data: {}, ports: [] }, {} as any, "GET", "user/me", {});
    await router.handle(request);
}

main();
