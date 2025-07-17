import { AuthGuard } from "core/guards/auth.guard";
import { UserService } from "modules/user/user.service";
import { Authorize, Controller, Get, Post, Request, IResponse, UseMiddlewares } from "@noxfly/noxus";
import { ControllerMiddleware } from "core/middlewares/controller.middleware";
import { ActionMiddleware } from "core/middlewares/action.middleware";

@Controller("user")
@UseMiddlewares([ControllerMiddleware])
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}
    
    @Get("me")
    @Authorize(AuthGuard)
    @UseMiddlewares([ActionMiddleware])
    public async getMyProfile(request: Request, response: IResponse): Promise<any> {
        console.log("Fetching current user's profile");
        return this.userService.findOneById("1");
    }

    @Post("profile")
    public async setProfile(request: Request, response: IResponse): Promise<any> {
        
    }

    @Get("profile/:id")
    public async getProfile(request: Request, response: IResponse): Promise<any> {
        const userId = request.params.id!;
        return this.userService.findOneById(userId);
    }

}
