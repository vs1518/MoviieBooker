import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'marieclaire', description: 'Nom d’utilisateur' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'marie@example.com', description: 'Adresse email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'pmotdepasse', description: 'Mot de passe (min. 6 caractères)' })
  @MinLength(6)
  password: string;
}
