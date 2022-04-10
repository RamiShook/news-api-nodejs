import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { CreateUserDto } from 'src/news/dtos/createUser.dto';
import { UserService } from 'src/news/services/user/user.service';

import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findAll();
  }
}
