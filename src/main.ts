import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

const validateEnvVariables = (configService: ConfigService) => {
  const variablesNotSetted: string[] = [];
  const variablesToValidate: string[] = [];

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
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const configService = app.get(ConfigService);
  validateEnvVariables(configService);
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      transform: true,
    }),
  );
  const port = +configService.get('PORT') || 3000;
  await app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
bootstrap();
