/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { request } from 'http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request: Request) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new ForbiddenException('Invalid authentication credentials');
      }
      const token: string[] = authHeader.split(' ');
      if (token[0] != 'Bearer') {
        throw new ForbiddenException('Invalid authentication credentials');
      }
      const payload = this.jwtService.verify(token[1], {
        secret: process.env.JWT_SECRET,
      });
      request.query['user'] = payload.user_id;
      return true;
    } catch (error) {
      Logger.error(`Gard Error. ${error.message}`);
      return false;
    }
  }
}
