import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
