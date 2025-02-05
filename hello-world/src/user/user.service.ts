import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export type User = any;

@Injectable()
export class UserService {
  private users = [
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

  getAllUsers() {
    return this.users; // Retourne simplement la liste des utilisateurs
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  addUser(user: User) {
    this.users.push(user);
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { username, email, password } = registerDto;
    
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: this.users.length + 1,
      username,
      email,
      password: hashedPassword,
    };

    this.users.push(newUser);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = this.users.find(user => user.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
