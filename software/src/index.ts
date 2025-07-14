import 'core/environment';
import { bootstrapApplication } from '@noxfly/noxus';
import { AppModule } from 'modules/app.module';
import { Application } from 'modules/app.service';

async function main(): Promise<void> {
    const noxApp = await bootstrapApplication(AppModule);

    noxApp.configure(Application);

    noxApp.start();
}

main();
