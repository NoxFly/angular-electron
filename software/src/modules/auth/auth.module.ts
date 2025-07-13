import { Module } from "engine/app";
import { AuthController } from "modules/auth/auth.controller";
import { AuthService } from "modules/auth/auth.service";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}