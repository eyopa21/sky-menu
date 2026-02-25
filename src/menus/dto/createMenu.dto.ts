import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateMenuDto {
  @IsPositive()
  @IsNotEmpty()
  readonly projectId: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly theme: string;

  @IsString()
  @IsOptional()
  @Length(2, 5)
  readonly language: string;
}
