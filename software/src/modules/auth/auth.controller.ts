import { Controller, Post, Request } from "@noxfly/noxus";
import { AuthService } from "modules/auth/auth.service";

@Controller("auth")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("login")
    public async login(request: Request): Promise<void> {
        const { username, password } = request.body;
        await this.authService.login(username, password);
    }
}
