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

  const endpointService = app.get(EndpointService);
  const routes = endpointService.getAllRoutes();
  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await queryRunner.query('TRUNCATE endpoint RESTART IDENTITY CASCADE');

    for (const route of routes) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Endpoint)
        .values({ url: route.path, method: route.method })
        .execute();
    }

    console.log('Endpoint table truncated successfully');
    await queryRunner.commitTransaction();
  } catch (err) {
    console.log('Failed to truncate endpoint table', err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

  Logger.log(`Application is running on: http://localhost:${PORT}`);
}
bootstrap();
