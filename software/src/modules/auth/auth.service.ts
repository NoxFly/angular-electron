import { Injectable } from "@noxfly/noxus";

@Injectable()
export class AuthService {
    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(false);
    }
}
