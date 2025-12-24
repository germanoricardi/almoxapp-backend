import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto extends PickType(UserDto, ['email', 'name']) {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
