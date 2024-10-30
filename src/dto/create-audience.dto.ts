import { IsNotEmpty } from 'class-validator';

export class CreateAudienceDto {
  @IsNotEmpty()
  date_audience: Date;

  request: string;

  availability: string;

  user: string;
}
