import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashModule } from './hash/hash.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScalarsModule } from './graphql/scalars/scalar.module';
import { CorsOptions } from 'apollo-server-express';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ScalarsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        let corsConfig: CorsOptions | undefined = undefined;
        const corsUrls = configService.get('CORS_URLS');
        if (corsUrls) {
          corsConfig = {
            credentials: true,
            origin: corsUrls,
          };
        }
        return {
          autoSchemaFile: true,
          cors: corsConfig,
        };
      },
    }),
    HashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
