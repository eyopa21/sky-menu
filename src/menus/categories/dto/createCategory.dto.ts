import { IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsPositive()
    @IsNotEmpty()
    readonly projectId: number

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    readonly name: string


    @IsUrl()
    readonly imageUrl: string

}