import { Request, Response } from "engine/request";
import { Controller, Get, Post } from "engine/router";
import { UserService } from "modules/user/user.service";

@Controller("user")
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get("me")
    public async getMyProfile(request: Request, response: Response): Promise<any> {
        // Simulate fetching user profile data
        const userProfile = {
            id: 1,
            name: "John Doe",
            email: ""
        };

        return userProfile;
    }

    @Post("profile")
    public async setProfile(request: Request, response: Response): Promise<void> {
        
    }

    @Get("profile/:id")
    public async getProfile(request: Request, response: Response): Promise<void> {
        
    }

}
