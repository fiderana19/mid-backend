import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsOptional()
  prenom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsNotEmpty()
  date_naissance: Date;

  @IsNotEmpty()
  @IsString()
  lieu_naissance: string;

  @IsNotEmpty()
  @IsString()
  cni: string;

  @IsNotEmpty()
  date_cni: Date;

  @IsNotEmpty()
  @IsString()
  lieu_cni: string;
}
