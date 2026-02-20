import {
  IsBoolean,
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

  @IsString()
  @IsOptional()
  readonly currency: string;

  @IsString()
  @IsOptional()
  readonly primaryColor: string | null;

  @IsString()
  @IsOptional()
  readonly accentColor: string | null;

  @IsBoolean()
  @IsOptional()
  readonly isPublished: boolean;

  @IsString()
  @IsOptional()
  readonly address: string | null;

  @IsString()
  @IsOptional()
  readonly phone: string | null;

  @IsString()
  @IsOptional()
  readonly website: string | null;
}
