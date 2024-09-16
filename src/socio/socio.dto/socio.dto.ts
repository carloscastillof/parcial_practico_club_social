import { IsNotEmpty, IsString } from 'class-validator';

export class SocioDto {
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  fechaNacimiento: Date;
}
