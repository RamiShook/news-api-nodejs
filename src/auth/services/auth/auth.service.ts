import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/news/services/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const userDB = await this.userService.findByUsername(username);
    if (userDB && (await bcrypt.compare(password, userDB.password))) {
      return userDB;
    } else {
      throw new UnauthorizedException();
    }
  }

  async login(req: any) {
    const payload = { user: req.user };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
