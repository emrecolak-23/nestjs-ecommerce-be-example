import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PUBLIC_KEY } from "../decorators";
import { Reflector } from "@nestjs/core";
import { UserPayload } from "src/auth/types";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService, private readonly configServive: ConfigService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest() as Request

        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true
        }

        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) throw new UnauthorizedException("Authentication token is missing");
        

        try {
            const userPayload = await this.jwtService.verifyAsync<UserPayload>(token, {
                secret: this.configServive.get<string>('JWT_SECRET'),
            }); 

            request.currentUser = {
                ...userPayload,
            }
       
        } catch (error) {
            if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
                throw new UnauthorizedException('Invalid or expired authentication token');
            }
            throw error;
        }


        return true
    }
}