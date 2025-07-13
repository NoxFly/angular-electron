import 'reflect-metadata';
import 'core/environment';
import { bootstrapApplication } from 'engine/bootstrap';
import { AppModule } from 'modules/app.module';
import { Application } from 'modules/app.service';

async function main(): Promise<void> {
    await bootstrapApplication(Application, AppModule);
}

main();
