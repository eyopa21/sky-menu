// src/config/environment.variables.ts
import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { registerAs } from '@nestjs/config';

export class RedisEnvironmentVariables {
  @IsString()
  REDIS_URL: string;

  @IsString()
  REDIS_PORT: string;
}

export default registerAs('redis', () => {
  const validatedConfig = plainToClass(RedisEnvironmentVariables, process.env, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
});
