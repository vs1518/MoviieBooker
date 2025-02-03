import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export type User = any;

@Injectable()
export class UserService {
  private users = [
    {
      id: 1,
      username: 'valeriya',
      email: 'valeriya@example.com',
      password: '$84b1$xxxxxxxxxxxxxxxxxxxxxx',
    },
    {
      id: 2,
      username: 'maria',
      email: 'maria@example.com',
      password: '$45r15#zzzzzzzzzzzzzzzzzzzzzz',
    },
  ];

  constructor(private jwtService: JwtService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async register(username: string, email: string, password: string): Promise<{ message: string }> {
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

  async login(email: string, password: string) {
    // Find user in "database"
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
