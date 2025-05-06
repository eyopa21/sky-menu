// src/config/environment.variables.ts
import { IsString, IsNumber, IsBoolean, validateSync, IsOptional } from 'class-validator';
import { plainToClass, Type } from 'class-transformer';
import { registerAs } from '@nestjs/config';

export class DatabaseEnvironmentVariables {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Type(() => Number)
  DB_PORT: number;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  DEBUG?: boolean;
}

export default registerAs('database', () => {
  const validatedConfig = plainToClass(DatabaseEnvironmentVariables, process.env, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;

})