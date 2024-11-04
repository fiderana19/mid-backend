import { IsNotEmpty } from 'class-validator';
import { AvailabilityStatus } from 'src/enums/availability.enum';

export class UpdateAvailabilityDto {
  @IsNotEmpty()
  status_availability: AvailabilityStatus;
}
