import { Type } from 'class-transformer';
import {
  IS_DATE,
  IS_DATE_STRING,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { SEX } from '../constants/sex.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  readonly phone_number: string;

  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @Type(() => Date)
  @IsDate()
  readonly date_of_birth: Date;

  @IsEnum(SEX)
  readonly sex: SEX;
}
