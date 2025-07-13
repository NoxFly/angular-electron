import { Injectable } from "engine/app";
import { Guard } from "engine/guards";
import { MaybeAsync } from "engine/misc";
import { Request } from "engine/request";
import { AuthService } from "modules/auth/auth.service";

@Injectable()
export class AuthGuard implements Guard {
    constructor(
        private readonly authService: AuthService
    ) {}

    public canActivate(request: Request): MaybeAsync<boolean> {
        return this.authService.isAuthenticated();
    }
}