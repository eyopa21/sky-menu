import { IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  readonly accessToken: string;

  @IsString()
  readonly refreshToken: string;
}
