import { ConfigService } from '@nestjs/config';
import { CorsOptions } from 'apollo-server-express';
import { EnvironmentVariable } from '@/enums/env.enum';
import { checkEnvVariablesAreDefined } from '../checkConfigVariables.utils';

const validateRegExpConfig = (configService: ConfigService) => {
  return checkEnvVariablesAreDefined(configService, [
    EnvironmentVariable.CORS_REG_EXP,
  ]);
};

export const getRegExpCorsConfig = (
  configService: ConfigService,
): CorsOptions | undefined => {
  if (!validateRegExpConfig) {
    console.log('Cors - Not valid single url cors env variables');
    return undefined;
  }
  const regexpConfig = configService.get(EnvironmentVariable.CORS_REG_EXP);
  const regExp = new RegExp(regexpConfig);
  return {
    credentials: true,
    origin: regExp,
  };
};
