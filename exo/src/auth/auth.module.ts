import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'Espoir15!', /
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}