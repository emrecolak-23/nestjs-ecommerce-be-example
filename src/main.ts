import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';
import { Logger, VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import { API_VERSION, SWAGGER_PREFIX } from './common';

async function bootstrap() {
  const logger = new Logger('App');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // app.setGlobalPrefix(API_VERSION);
  app.useLogger(app.get(PinoLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  });

  const document = createDocument(app);
  SwaggerModule.setup(SWAGGER_PREFIX, app, document);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  await app.listen(PORT!);

  logger.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
