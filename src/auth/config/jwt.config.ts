// src/config/environment.variables.ts
import {
  IsString,
  IsNumber,
  IsBoolean,
  validateSync,
  IsOptional,
} from 'class-validator';
import { plainToClass, Type } from 'class-transformer';
import { registerAs } from '@nestjs/config';

export class JwtEnvironmentVariables {
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;
}

export default registerAs('jwt', () => {
  const validatedConfig = plainToClass(JwtEnvironmentVariables, process.env, {
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
