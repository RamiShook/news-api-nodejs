import { forwardRef, Module } from '@nestjs/common';
import { UserService } from 'src/news/services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { User } from 'src/news/entities/User';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/LocalStrategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './Constants';
import { JwtStrategy } from './utils/jwt.Strategy';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => NewsModule),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
