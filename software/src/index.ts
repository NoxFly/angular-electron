import 'reflect-metadata';
import 'core/environment';
import { bootstrapApplication } from 'engine/bootstrap';
import { Application } from 'modules/app.service';
import { AppModule } from 'modules/app.module';

async function main(): Promise<void> {
    await bootstrapApplication(Application, AppModule);
}

main();