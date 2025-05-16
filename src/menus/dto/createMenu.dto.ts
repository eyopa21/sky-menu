import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsPositive()
  @IsNotEmpty()
  readonly projectId: number;

  @IsNotEmpty()
  @IsString()
  readonly theme: string;
}
