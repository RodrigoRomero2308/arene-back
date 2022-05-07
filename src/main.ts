import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import helmet from 'helmet';
import * as session from 'express-session';
import { EnvironmentVariable } from './enums/env.enum';

const validateEnvVariables = (configService: ConfigService) => {
  const variablesNotSetted: string[] = [];
  const variablesToValidate: string[] = [EnvironmentVariable.SESSION_SECRET];

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
  const app = await NestFactory.create(AppModule);
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
  app.use(
    session({
      secret: sessionSecret || 'secret',
      saveUninitialized: false,
      resave: false,
      name: 'sessId',
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  const port = +configService.get(EnvironmentVariable.PORT) || 3000;
  await app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
bootstrap();
