import { Request, Response } from "core/engine/request";
import { Controller, Get } from "core/engine/router";

@Controller("user")
export class UserController {
    
    @Get("/profile")
    public async getProfile(request: Request, response: Response): Promise<any> {
        // Simulate fetching user profile data
        const userProfile = {
            id: 1,
            name: "John Doe",
            email: ""
        };

        return userProfile;
    }

}
