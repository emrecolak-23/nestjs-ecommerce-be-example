import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { SWAGGER_CONFIG } from './swagger.config';

export function createDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'authorization')
    .setVersion(SWAGGER_CONFIG.version);

  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./openApi.json', JSON.stringify(document));

  return document;
}
