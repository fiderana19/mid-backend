import { IsBoolean } from "class-validator";

export class ValidateUserDto {
    @IsBoolean()
    validation: boolean;
}