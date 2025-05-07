import { Type } from "class-transformer";
import { IS_DATE, IS_DATE_STRING, IsDate, IsEnum, IsString, MinLength } from "class-validator";
import { SEX } from "../constants/sex.enum";


export class CreateUserDto {
    @IsString()
    readonly full_name: string

    @IsString()
    readonly email: string

    @IsString()
    @MinLength(10)
    readonly phone_number: string

    @MinLength(6)
    readonly password: string

    
    @Type(() => Date)
    @IsDate()
    readonly date_of_birth: Date;
  
    @IsEnum(SEX)
    readonly sex: SEX;
}

