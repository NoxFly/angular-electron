import { AuthGuard } from "core/guards/auth.guard";
import { Authorize } from "engine/guards";
import { Request, Response } from "engine/request";
import { Controller, Get, Post } from "engine/router";
import { UserService } from "modules/user/user.service";

@Controller("user")
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get("me")
    @Authorize(AuthGuard)
    public async getMyProfile(request: Request, response: Response): Promise<any> {
        const userProfile = {
            id: 1,
            name: "John Doe",
            email: ""
        };

        return userProfile;
    }

    @Post("profile")
    public async setProfile(request: Request, response: Response): Promise<any> {
        
    }

    @Get("profile/:id")
    public async getProfile(request: Request, response: Response): Promise<any> {
        const userProfile = {
            id: 1,
            name: "John Doe",
            email: "john.doe@email.com"
        };

        return userProfile;
    }

}
