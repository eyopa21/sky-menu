// src/config/environment.variables.ts
import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { registerAs } from '@nestjs/config';

export class CloudinaryEnvironmentVariables {
  @IsString()
  CLOUDINARY_NAME: string;

  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsString()
  CLOUDINARY_API_SECRET: string;
}

export default registerAs('jwt', () => {
  const validatedConfig = plainToClass(
    CloudinaryEnvironmentVariables,
    process.env,
    {
      enableImplicitConversion: true,
    },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
});
