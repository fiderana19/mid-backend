import { IsNotEmpty, IsString } from "class-validator";

export class CreateRequestDto {
    @IsNotEmpty()
    @IsString()
    motif: string;
}