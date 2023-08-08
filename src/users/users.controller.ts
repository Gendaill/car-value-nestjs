import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { serialize } from '../interceptors/serialize.interceptor';
import { userDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@serialize(userDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/singup')
  createUser(@Body() body: CreateUserDto) {
    this.authService.singup(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get()
  findAll(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }
}
