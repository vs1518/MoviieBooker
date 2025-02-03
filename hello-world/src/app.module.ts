import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [UserModule, UserModule, AuthModule],
  controllers: [AppController, UserController, UserController],
  providers: [AppService, UserService, UserService, JwtStrategy],
})
export class AppModule {}
