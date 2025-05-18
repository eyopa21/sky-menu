import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class FilterUserDto {
  @ApiPropertyOptional({
    description: 'Filter by name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by phone number',
    example: '0912345678',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({
    description: 'Filter by email',
    example: 'user@email.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;
}

export class SortUserDto {
  @ApiProperty({
    description: 'The field to sort by',
    example: 'value',
  })
  @IsString()
  orderBy: string;

  @ApiProperty({
    description: 'The order of sorting, either ASC or DESC',
    example: 'ASC',
  })
  @IsString()
  order: 'ASC' | 'DESC';
}

export class QueryUserDto {
  @ApiPropertyOptional({
    description: 'The current page number',
    example: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsPositive()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'The number of users per page',
    example: 10,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filters to apply on the users query',
    type: String,
    example: JSON.stringify({ categoryId: 1, name: 'Example user' }),
  })
  @Transform(({ value }) =>
    value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  @IsOptional()
  filters?: FilterUserDto | null;

  @ApiPropertyOptional({
    description: 'Sort options for the users query',
    type: String,
    example: JSON.stringify([{ orderBy: 'name', order: 'ASC' }]),
  })
  @Transform(({ value }) =>
    value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  @IsOptional()
  sort?: SortUserDto[] | null;
}
