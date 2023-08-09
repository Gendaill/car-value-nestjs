import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify<string, string, number, Buffer>(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async singup(email: string, password: string) {
    // see if email exists
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // hash password
    const salt = randomBytes(8).toString('hex');
    const hash: Buffer = await scrypt(password, salt, 32);
    const result = salt + '.' + hash.toString('hex');

    // create new user and save it
    const user = await this.usersService.create(email, result);
    // return user
    return user;
  }

  async singin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash: Buffer = await scrypt(password, salt, 32);

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }
}
