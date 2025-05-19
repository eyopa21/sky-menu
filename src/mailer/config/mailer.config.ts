// src/config/environment.variables.ts
import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { registerAs } from '@nestjs/config';

export class MailerConfigEnvironmentVariables {
  @IsString()
  GMAIL_APP_USERNAME: string;

  @IsString()
  GMAIL_APP_PASSWORD: string;
}

export default registerAs('mailer', () => {
  const validatedConfig = plainToClass(
    MailerConfigEnvironmentVariables,
    process.env,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
});
