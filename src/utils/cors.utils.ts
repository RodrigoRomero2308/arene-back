import { ConfigService } from '@nestjs/config';
import { CorsOptions } from 'apollo-server-express';
import { getRegExpCorsConfig } from './corsMethodsFunctions/regexp.cors.utils';
import { getSingleUrlCorsConfig } from './corsMethodsFunctions/singleUrl.cors.utils';

export enum CorsMethod {
  REGEXP = 'regexp',
  SINGLE_URL = 'single_url',
  MULTIPLE_URLs = 'multiple_urls',
}

export const getCorsConfig = (configService: ConfigService): CorsOptions => {
  let corsConfig: CorsOptions = {
    credentials: true,
  };

  const corsMethod = configService.get('CORS_METHOD');

  switch (corsMethod) {
    case CorsMethod.MULTIPLE_URLs:
      /* TODO: implementar */
      break;
    case CorsMethod.SINGLE_URL:
      const singleCorsConfig = getSingleUrlCorsConfig(configService);
      if (singleCorsConfig) corsConfig = singleCorsConfig;
      break;
    case CorsMethod.REGEXP:
      const regExpCorsConfig = getRegExpCorsConfig(configService);
      if (regExpCorsConfig) corsConfig = regExpCorsConfig;
      break;
    default:
      break;
  }

  console.log('Cors set to:', corsConfig.origin);

  return corsConfig;
};
