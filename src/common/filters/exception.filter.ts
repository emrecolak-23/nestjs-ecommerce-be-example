import { ArgumentsHost, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {

    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse() as Response;
        const status = exception.getStatus ? exception.getStatus() : 500;
        const exceptionResponse = exception.getResponse ? exception.getResponse() : null;
        const error = typeof response === 'string' ? 
                      { message: exceptionResponse} :  
                      exceptionResponse as object

        
        response.status(status).json({
            message: (error as any)?.message || 'Internal server error',
            error: (error as any)?.error || null,
        })

    }
}