import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT')!;

  // app.use(helmet());

  // CORS Configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    methods: configService.get<string>('CORS_METHODS'),
    allowedHeaders: configService.get<string>('CORS_ALLOWED_HEADERS'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
    }),
  );

  await app.listen(appPort).then(() => {
    console.log(`🚀 Server is running on http://localhost:${appPort}`);
  });
}

void bootstrap();
