import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import { EndpointService } from './endpoint/endpoint.service';
import { Endpoint } from './endpoint/entities/endpoint.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permissions/entities/permission.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(PinoLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerPrefix = 'api-docs';
  const document = createDocument(app);
  SwaggerModule.setup(swaggerPrefix, app, document);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT!);

  Logger.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
