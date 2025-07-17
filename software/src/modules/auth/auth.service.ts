import { Injectable, UnauthorizedException } from "@noxfly/noxus";
import { UserService } from "modules/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
    ) {}

    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public async login(username: string, password: string): Promise<void> {
        const user = await this.userService.findOneByUsername(username);

        if(!user || user.password !== password) {
            throw new UnauthorizedException();
        }

        // Here you would typically set a session or token

        return Promise.resolve();
    }
}
