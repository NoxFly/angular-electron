import { AuthService } from "modules/auth/auth.service";
import { IGuard, Injectable, MaybeAsync, Request } from "@noxfly/noxus";

@Injectable()
export class AuthGuard implements IGuard {
    constructor(
        private readonly authService: AuthService
    ) {}

    public canActivate(request: Request): MaybeAsync<boolean> {
        console.log(`[AuthGuard] Checking authentication for request: ${request.method} ${request.path}`);
        return this.authService.isAuthenticated();
    }
}