import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import helmet from 'helmet';
import * as session from 'express-session';
import { EnvironmentVariable } from './enums/env.enum';
import Redis from 'ioredis';
import * as ConnectRedis from 'connect-redis';
import { NestExpressApplication } from '@nestjs/platform-express';

const RedisStore = ConnectRedis(session);

const validateEnvVariables = (configService: ConfigService) => {
  const variablesNotSetted: string[] = [];
  const variablesToValidate: string[] = [
    EnvironmentVariable.SESSION_SECRET,
    EnvironmentVariable.REDIS_URL,
    EnvironmentVariable.DATABASE_URL,
  ];

  variablesToValidate.forEach((variable) => {
    const configuredVariable = configService.get(variable);
    if (!configuredVariable) {
      variablesNotSetted.push(variable);
    }
  });

  if (variablesNotSetted.length) {
    throw new Error(
      `Environment variables not setted: ${variablesNotSetted.join(', ')}`,
    );
  }

  return;
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const configService = app.get(ConfigService);
  const sessionSecret = configService.get<string>(
    EnvironmentVariable.SESSION_SECRET,
  );

  validateEnvVariables(configService);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      transform: true,
    }),
  );

  // Session prep
  const redisUrl = configService.get(EnvironmentVariable.REDIS_URL) || '';
  const redisClient = new Redis(redisUrl);

  const nodeEnv = configService.get('NODE_ENV');

  if (nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true, // deshabilitamos el touch por defecto del cliente para manejar nosotros el resave (en los guards)
      }),
      secret: sessionSecret || 'secret',
      saveUninitialized: false,
      resave: false,
      name: configService.get(EnvironmentVariable.SESSION_NAME) || 'sessId',
      cookie: {
        secure: nodeEnv === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );

  // Start the app
  const port = +configService.get(EnvironmentVariable.PORT) || 3000;
  await app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
bootstrap();
