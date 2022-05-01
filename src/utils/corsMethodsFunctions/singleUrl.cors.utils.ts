import { ConfigService } from '@nestjs/config';
import { CorsOptions } from 'apollo-server-express';
import { checkEnvVariablesAreDefined } from '../checkConfigVariables.utils';

const validateSingleUrlCorsConfig = (configService: ConfigService) => {
  return checkEnvVariablesAreDefined(configService, ['CORS_URL']);
};

export const getSingleUrlCorsConfig = (
  configService: ConfigService,
): CorsOptions | undefined => {
  if (!validateSingleUrlCorsConfig(configService)) {
    console.log('Cors - Not valid single url cors env variables');
    return undefined;
  }
  const corsUrl = configService.get('CORS_URL');
  return {
    origin: corsUrl,
    credentials: true,
  };
};
