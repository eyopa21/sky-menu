import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly logo: string;

  @IsUrl()
  @IsString()
  @IsOptional()
  readonly coverImage: string | null;
}
