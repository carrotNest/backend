import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor{

    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const body = request.body;
        const query = request.query;
        const param = request.param;

        const bodyMessage = Object.keys(body).length? `body: ${JSON.stringify(body, null, 2)}` : '';
        const queryMessage = Object.keys(query).length? ` \n query: ${JSON.stringify(query, null, 2)}` : '';
        const paramMessage = Object.keys(param).length? ` \n param: ${JSON.stringify(param, null, 2)}`: '';

        this.logger.log(`Request: ${method} ${url} ${bodyMessage} ${queryMessage} ${paramMessage}`);

        return next
            .handle()
            .pipe(
                tap((data) => this.logger.log(`Response from ${method} ${url} ${context.getClass().name} ${Date.now() - now}ms \n
                Response: ${JSON.stringify(data, null, 2)}`))
            );
    }
}