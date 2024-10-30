import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  object: string;

  @IsOptional()
  date_wanted_debut: Date;

  @IsOptional()
  date_wanted_end: Date;
}
