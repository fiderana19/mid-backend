import { IsNotEmpty, IsString } from 'class-validator';
import { RequestType } from 'src/enums/requesttype.enum';

export class CreateRequestDto {
  type_request: RequestType;

  @IsNotEmpty()
  @IsString()
  object: string;

  @IsNotEmpty()
  date_wanted_debut: Date;

  @IsNotEmpty()
  date_wanted_end: Date;
}
