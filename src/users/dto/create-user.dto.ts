import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { SEX } from '../constants/sex.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name',
  })
  @IsString()
  @IsNotEmpty()
  readonly full_name: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'Email',
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: '0912345678',
    description: 'Phone number',
  })
  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  readonly phone_number: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'User password',
    format: 'password',
  })
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: '2025-09-30T00:00:00.000Z',
    description: 'Birth Date',
  })
  @Type(() => Date)
  @IsDate()
  readonly date_of_birth: Date;

  @ApiProperty({
    example: 'male | female',
    description: 'Gender',
  })
  @IsEnum(SEX)
  readonly sex: SEX;
}
