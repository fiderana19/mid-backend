import { IsNotEmpty } from "class-validator";

export class UpdateAvailabilityDto {
    @IsNotEmpty()
    date_availability: Date;

    @IsNotEmpty()
    hour_debut: Date;

    @IsNotEmpty()
    hour_end: Date;
}