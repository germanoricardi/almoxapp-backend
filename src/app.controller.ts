import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './v1/users/dto/create-user.dto';
import { UsersService } from './v1/users/users.service';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './v1/users/dto/user.dto';
import { AuthService } from './v1/auth/auth.service';
import { Public } from './common/v1/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Public()
  getIndex(): string {
    return this.appService.index();
  }

  @Public()
  @Post('v1/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    const loginUser = await this.authService.validateUser({
      email: user.email,
      password: createUserDto.password,
    });

    const tokens = await this.authService.login(loginUser);

    return {
      user: plainToInstance(UserDto, user),
      ...tokens,
    };
  }
}
