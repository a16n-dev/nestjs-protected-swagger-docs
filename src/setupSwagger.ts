import {INestApplication} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as basicAuth from "express-basic-auth";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

/**
 * Sets up password-protected swagger documentation for the application
 */
export const setupSwagger = (app: INestApplication) => {
  const swaggerPassword = app.get(ConfigService).get('SWAGGER_PASSWORD');

  // Note: It's important that this comes BEFORE calling SwaggerModule.setup()
  if (process.env.NODE_ENV !== 'development') {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          admin: swaggerPassword,
        },
      }),
    );
  }

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
}