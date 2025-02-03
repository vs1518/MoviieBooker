import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Générer un token JWT
  generateToken(user: any): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }

  // Vérifier un token JWT
  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}