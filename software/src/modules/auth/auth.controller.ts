import { Controller } from "@noxfly/noxus";
import { AuthService } from "modules/auth/auth.service";

@Controller("user")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

}
