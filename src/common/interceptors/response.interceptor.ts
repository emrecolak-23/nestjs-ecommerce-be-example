import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { RESPONSE_MESSAGE_KEY } from "../decorators/response-message.decorator";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(data => {
                if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
                    return data;
                }
                
                const message = this.reflector.get<string>(
                    RESPONSE_MESSAGE_KEY,
                    context.getHandler(),
                ) || undefined
                
                return {
                    message,
                    data: data,
                };
            })
        )
    }
}