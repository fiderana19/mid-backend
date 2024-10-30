import { IsNotEmpty } from 'class-validator';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  date_availability: Date;

  @IsNotEmpty()
  hour_debut: Date;

  @IsNotEmpty()
  hour_end: Date;
}
