import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as basicAuth from 'express-basic-auth';

const SWAGGER_PATH = '/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Note: It's important that this comes BEFORE calling SwaggerModule.setup
  app.use(
      [SWAGGER_PATH, `${SWAGGER_PATH}-json`],
      basicAuth({
        challenge: true,
        users: {
          ['admin']: 'admin',
        },
      }),
  );

  const config = new DocumentBuilder()
      .setTitle('Cats example')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('cats')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(3000);
}

bootstrap();
