import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Users } from 'src/database/entities/user.entity';
import { SystemDataSource } from 'src/database/system.datasource';
import { Utils } from 'src/utils/utils.service';

@Injectable()
export class UsersService {
  constructor(private utils: Utils) {}
  async registerUser(request: Request) {
    try {
      const user: Partial<Users> = request.body;
      const existingUser = await SystemDataSource.manager.findOne(Users, {
        where: {
          username: user.username,
        },
      });
      if (existingUser) {
        throw new BadRequestException(`Username already takedn`);
      }
      const password = await this.utils.hashPassword(user.password);
      user['password'] = password;
      const { username, fullname } = await SystemDataSource.manager.save(
        Users,
        user,
      );
      return {
        statusCode: 200,
        description: 'User created successfully',
        user: {
          fullname,
          username,
        },
      };
    } catch (error) {
      Logger.error(
        `Error registering user: ${error.message}`,
        error.stack,
        'User Registration',
      );
      throw new HttpException(
        error?.response ?? error.message,
        error?.status ?? 400,
      );
    }
  }
}
