import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './v1/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'src/setup/configs/env.config';
import { envValidationSchema } from './setup/configs/env-validation-schema.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabaseConfig } from './setup/configs/typeorm.config';
import { AuthModule } from './v1/auth/auth.module';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './v1/auth/auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('rateLimit.ttl')!,
          limit: configService.get<number>('rateLimit.limit')!,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/setup/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
})
export class AppModule {}
