import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Validation des données
    if (!loginDto.email || !loginDto.password) {
      return { message: 'Email et mot de passe requis' };
    }

    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        return { message: 'Identifiants invalides' };
      }
      const token = await this.authService.generateToken(user);
      return { access_token: token };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { message: 'Erreur interne du serveur' };
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // Validation des données
    if (!registerDto.email || !registerDto.password || !registerDto.username) {
      return { message: 'Tous les champs sont requis' };
    }

    try {
      const user = await this.authService.register(registerDto); // Utilisez register au lieu de registerUser
      return { message: 'Inscription réussie', user };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { message: 'Erreur interne du serveur' };
    }
  }
}