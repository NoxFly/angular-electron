import { Module } from "@noxfly/noxus";
import { UserController } from "modules/user/user.controller";
import { UserService } from "modules/user/user.service";

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}