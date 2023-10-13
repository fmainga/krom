/* eslint-disable prettier/prettier */
import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  registerUser(@Req() request: Request) {
    return this.usersService.registerUser(request);
  }
  @Post('login')
  loginUser(@Req() request: Request) {
    return this.authService.loginUser(request);
  }
}
