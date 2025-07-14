import { Module } from "@noxfly/noxus";
import { AuthModule } from "modules/auth/auth.module";
import { UserModule } from "modules/user/user.module";

@Module({
    imports: [UserModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
