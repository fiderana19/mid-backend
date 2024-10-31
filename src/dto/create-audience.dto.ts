import { IsNotEmpty } from 'class-validator';

export class CreateAudienceDto {
  request: string;

  availability: string;

  user: string;
}
