import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // Validation des données
      if (!registerDto.email || !registerDto.password || !registerDto.username) {
        throw new BadRequestException('Tous les champs sont requis');
      }

      // Vérification de l'existence de l'utilisateur
      const existingUser = await this.usersService.findOneByEmail(registerDto.email);
      if (existingUser) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }

      // Vérification de l'existence du nom d'utilisateur
      const existingUsername = await this.usersService.findOneByUsername(registerDto.username);
      if (existingUsername) {
        throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // Création du nouvel utilisateur
      const newUser = {
        id: Date.now(),
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      };

      // Ajout de l'utilisateur
      await this.usersService.addUser(newUser);

      // Génération du token JWT
      const payload = { sub: newUser.id, email: newUser.email };
      const access_token = this.jwtService.sign(payload);

      // Retour de la réponse
      return {
        message: 'Inscription réussie',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        },
        access_token
      };

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    try {
      const { email, password } = loginDto;

      // Validation des données
      if (!email || !password) {
        throw new BadRequestException('Email et mot de passe requis');
      }

      // Recherche de l'utilisateur
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // Vérification du mot de passe
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      // Génération du token JWT
      const payload = { sub: user.id, email: user.email };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException('Erreur lors de la connexion. Veuillez réessayer.');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    // Logique pour valider l'utilisateur
    const user = await this.findUserByEmail(email); // Implémentez cette méthode
    if (user && user.password === password) { // Assurez-vous de ne pas stocker les mots de passe en clair
      return user;
    }
    return null;
  }

  async generateToken(user: User): Promise<string> {
    // Logique pour générer un token JWT
    // Remplacez ceci par votre logique de génération de token
    return 'token'; // Remplacez par la génération réelle du token
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    // Implémentez cette méthode pour trouver un utilisateur par email
    return null; // Remplacez par la logique de recherche dans la base de données
  }
}