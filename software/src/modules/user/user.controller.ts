import { AuthGuard } from "core/guards/auth.guard";
import { UserService } from "modules/user/user.service";
import { Authorize, Controller, Get, Post, Request, IResponse } from "@noxfly/noxus";

@Controller("user")
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get("me")
    @Authorize(AuthGuard)
    public async getMyProfile(request: Request, response: IResponse): Promise<any> {
        const userProfile = {
            id: 1,
            name: "John Doe",
            email: ""
        };

        return userProfile;
    }

    @Post("profile")
    public async setProfile(request: Request, response: IResponse): Promise<any> {
        
    }

    @Get("profile/:id")
    public async getProfile(request: Request, response: IResponse): Promise<any> {
        const userProfile = {
            id: 1,
            name: "John Doe",
            email: "john.doe@email.com"
        };

        return userProfile;
    }

}
