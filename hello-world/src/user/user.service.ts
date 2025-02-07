import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      username: 'valeriya',
      email: 'valeriya@example.com',
      password: '$2b$10$abcdefghijklmnopqrstuv', // Example hashed password
    },
    {
      id: 2,
      username: 'maria',
      email: 'maria@example.com',
      password: '$45r15#zdnksenfnferjirjfoierp', // Example hashed password
    },
  ];

  constructor(private jwtService: JwtService) {}

  getAllUsers(): User[] {
    return this.users;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  async register(registerDto: RegisterDto): Promise<{ message: string; user: Partial<User> }> {
    try {
      const { username, email, password } = registerDto;

      // Vérification de l'email existant
      const existingEmail = await this.findOneByEmail(email);
      if (existingEmail) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }

      // Vérification du nom d'utilisateur existant
      const existingUsername = await this.findOneByUsername(username);
      if (existingUsername) {
        throw new BadRequestException('Ce nom d\'utilisateur est déjà pris');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser: User = {
        id: this.users.length + 1,
        username,
        email,
        password: hashedPassword,
      };

      this.users.push(newUser);

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = newUser;
      return {
        message: 'Inscription réussie',
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Partial<User> }> {
    try {
      const { email, password } = loginDto;

      const user = await this.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
      }

      const payload = { sub: user.id, email: user.email, username: user.username };
      
      // Retourner le token et les informations de l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return {
        access_token: this.jwtService.sign(payload),
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<Partial<User> | null> {
    const user = await this.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}