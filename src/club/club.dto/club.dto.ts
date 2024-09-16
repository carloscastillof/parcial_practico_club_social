import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ClubDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  fechaFundacion: string;

  @IsUrl()
  imagen: string;

  @IsString()
  descripcion: string;
}
