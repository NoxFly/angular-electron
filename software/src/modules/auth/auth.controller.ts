import { Controller } from "engine/router";
import { AuthService } from "modules/auth/auth.service";

@Controller("user")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

}
