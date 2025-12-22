import { PickType } from '@nestjs/mapped-types';
import { UserDto } from 'src/v1/users/dto/user.dto';

export class RequestPasswordResetDto extends PickType(UserDto, ['email']) {}
