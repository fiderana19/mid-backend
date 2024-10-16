import { IsNotEmpty } from "class-validator";

export class UpdateAvailabilityDto {
    @IsNotEmpty()
    hour_debut: Date;

    @IsNotEmpty()
    hour_end: Date;
}