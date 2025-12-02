import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "src/auth/types";

export const CurrentUser = createParamDecorator(
    (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
        if (ctx.getType() === 'http') {
            const request = ctx.switchToHttp().getRequest() as Request & { currentUser?: UserPayload };
            const user = request.currentUser as UserPayload;
            return data ? user?.[data] : user;
        }
    }
)