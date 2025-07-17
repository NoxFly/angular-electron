import { IMiddleware, Injectable, IResponse, NextFunction, Request } from '@noxfly/noxus';

@Injectable()
export class ControllerMiddleware implements IMiddleware {
    public async invoke(request: Request, response: IResponse, next: NextFunction): Promise<void> {
        console.log(`[ControllerMiddleware] before next()`);
        await next();
        console.log(`[ControllerMiddleware] after next()`);
    }
}