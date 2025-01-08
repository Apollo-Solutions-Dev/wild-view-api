import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findOne(@Req() request) {
    return this.userService.findOne(request.user.userId);
  }

  @Put()
  async updateUser(@Body() userData: User) {
    return this.userService.updateUser(userData);
  }

  @Post('register')
  async register(@Body() userData: User) {
    return this.authService.signUp(userData);
  }
}
