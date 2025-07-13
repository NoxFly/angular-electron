import { Module } from "engine/app";
import { UserController } from "modules/user/user.controller";
import { UserService } from "modules/user/user.service";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
    exports: [],
})
export class UserModule {}