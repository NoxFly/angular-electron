import { Module } from "engine/app";
import { UserModule } from "modules/user/user.module";

@Module({
    imports: [UserModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
