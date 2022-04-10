import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/news/dtos/createUser.dto';
import { SerializedUser } from 'src/news/dtos/serializedUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/news/entities/User';
import { Repository } from 'typeorm';
import { encryptPassword } from 'src/news/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    if (await this.findByUsername(createUserDto.username)) {
      return { message: 'Username Already Taken!' };
    }

    const password = encryptPassword(createUserDto.password);
    const newUser = this.userRepository.create({ ...createUserDto, password });

    return plainToInstance(
      SerializedUser,
      await this.userRepository.save(newUser),
    );
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ username });
  }

  async findAll() {
    const users = await this.userRepository.find({});
    return users.map((user) => plainToInstance(SerializedUser, user));
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) return plainToInstance(SerializedUser, user);
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
