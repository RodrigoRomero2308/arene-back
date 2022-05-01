import { ConfigService } from '@nestjs/config';

export const checkEnvVariablesAreDefined = (
  configService: ConfigService,
  variables: string[],
) => {
  return variables.every((variable) => {
    const variableValue = configService.get(variable);
    return variableValue !== null && typeof variableValue !== 'undefined';
  });
};
