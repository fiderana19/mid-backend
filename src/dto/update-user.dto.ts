import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsOptional()
    email: string;

    @IsOptional()
    password: string;
}