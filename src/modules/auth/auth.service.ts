/* eslint-disable prettier/prettier */
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Users } from 'src/database/entities/user.entity';
import { SystemDataSource } from 'src/database/system.datasource';
import { Utils } from 'src/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(private utils: Utils) {}
  async loginUser(request: Request) {
    try {
      const userInfo: Partial<Users> = request.body;
      const user = await SystemDataSource.manager.findOne(Users, {
        where: {
          username: userInfo.username,
        },
      });
      if (!user) {
        Logger.error(`No user with username ${userInfo.username} exists`);
        throw new Error('No User with that username exists');
      }
      const passwordcheck = await this.utils.comparePasswordHash(
        userInfo.password,
        user.password,
      );
      if (!passwordcheck) {
        Logger.error(`Invalid password for user ${userInfo.username}`);
        throw new Error('Invalid password');
      }
      const accesstoken = this.utils.signPayload({
        user_id: user.user_id,
      });
      return {
        user_id: user.user_id,
        username: user.username,
        access_token: accesstoken,
      };
    } catch (error) {
      Logger.error(`Login Error: ${error.message}`, error.stack, 'User Login');
      throw new UnauthorizedException(`Invalid login credentials`);
    }
  }
}
