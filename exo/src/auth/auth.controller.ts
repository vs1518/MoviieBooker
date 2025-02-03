import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: any) {
    
    const newUser = { id: 1, username: user.username, password: user.password };
    const token = this.authService.generateToken(newUser);
    return { user: newUser, token };
  }

  @Post('login')
  async login(@Body() user: any) {
    
    const foundUser = { id: 1, username: user.username, password: user.password };
    const token = this.authService.generateToken(foundUser);
    return { user: foundUser, token };
  }
}