import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const configService = app.get(ConfigService);
  const port = +configService.get('PORT') || 3000;
  await app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
bootstrap();
