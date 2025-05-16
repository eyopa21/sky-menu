import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  readonly menuId: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  readonly categoryId: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  images: string[];

  @IsBoolean()
  @IsOptional()
  vatIncluded: boolean;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
