import { IMiddleware, Injectable, IResponse, NextFunction, Request } from '@noxfly/noxus';

@Injectable()
export class RootMiddleware implements IMiddleware {
    public async invoke(request: Request, response: IResponse, next: NextFunction): Promise<void> {
        // Example: Log the request method and URL, then call next()
        console.log(`[RootMiddleware] before next()`);
        await next();
        console.log(`[RootMiddleware] after next()`);
    }
}