import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Endpoint } from './endpoint/entities/endpoint.entity';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter, ResponseInterceptor } from './common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common';
import { RoleModule } from './role/role.module';
import { EndpointModule } from './endpoint/endpoint.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: { target: 'pino-pretty' },
        serializers: {
          req: (req) => {
            const contentType = req.headers['content-type'];
            let body;

            if (contentType?.includes('application/json')) {
              try {
                body = JSON.stringify(JSON.parse(req.raw.body), null, 2);
              } catch (error) {
                body = req.raw.body;
              }
            } else {
              body = req.raw.body;
            }

            return {
              method: req.method,
              url: req.url,
              params: req.params,
              query: req.query,
              contentType,
              body,
            };
          },
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Role, Endpoint],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    EndpointModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
