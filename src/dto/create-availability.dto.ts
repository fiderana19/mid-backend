import { IsNotEmpty } from "class-validator";

export class CreateAvailabilityDto {
    @IsNotEmpty()
    hour_debut: Date;

    @IsNotEmpty()
    hour_end: Date;
}