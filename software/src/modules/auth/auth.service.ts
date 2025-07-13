import { Injectable } from "engine/app";

@Injectable()
export class AuthService {
    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(false);
    }
}
