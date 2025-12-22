import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ password, ...createUserDto }: CreateUserDto) {
    try {
      const password_hash = await bcrypt.hash(password, 10);
      return await this.userRepository.save({
        ...createUserDto,
        password_hash,
      });
    } catch (error) {
      //TODO implementar winston

      console.log(error);
      throw new HttpException(
        'Não foi possível salvar os dados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: string, { password, ...updateUserDto }: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const password_hash = !password
      ? user.password_hash
      : await bcrypt.hash(password, 10);

    try {
      return await this.userRepository.update(id, {
        ...user,
        ...updateUserDto,
        password_hash,
      });
    } catch (error) {
      //TODO implementar winston

      console.log(error);
      throw new HttpException(
        'Não foi possível atualizar os dados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
