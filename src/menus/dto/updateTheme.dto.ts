import { IsNotEmpty, IsString } from "class-validator";

export class UpdateThemeDto {
    @IsString()
    @IsNotEmpty()
    readonly theme: string
}