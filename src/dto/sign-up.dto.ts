import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/enums/role.enum";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    roles: Role;
}