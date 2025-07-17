import { IMiddleware, Injectable, IResponse, NextFunction, Request } from '@noxfly/noxus';

@Injectable()
export class ActionMiddleware implements IMiddleware {
    public async invoke(request: Request, response: IResponse, next: NextFunction): Promise<void> {
        console.log(`[ActionMiddleware] before next()`);
        await next();
        console.log(`[ActionMiddleware] after next()`);
    }
}