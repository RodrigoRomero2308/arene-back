import { ConfigService } from '@nestjs/config';
import { CorsOptions } from 'apollo-server-express';
import { EnvironmentVariable } from 'src/enums/env.enum';
import { checkEnvVariablesAreDefined } from '../checkConfigVariables.utils';

const validateSingleUrlCorsConfig = (configService: ConfigService) => {
  return checkEnvVariablesAreDefined(configService, [
    EnvironmentVariable.CORS_URL,
  ]);
};

export const getSingleUrlCorsConfig = (
  configService: ConfigService,
): CorsOptions | undefined => {
  if (!validateSingleUrlCorsConfig(configService)) {
    console.log('Cors - Not valid single url cors env variables');
    return undefined;
  }
  const corsUrl = configService.get(EnvironmentVariable.CORS_URL);
  return {
    origin: corsUrl,
    credentials: true,
  };
};
