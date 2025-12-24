import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDto } from 'src/v1/users/dto/user.dto';

export class LoginDto extends PickType(UserDto, ['email']) {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
