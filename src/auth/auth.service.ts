import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findByEmail(email);

    const passwordMatch = await bcrypt.compare(pass, user.password);

    if (!user || !passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      userId: user.id,
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.generateRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
    };
}

  async signUp(signUpDto: User) {
    return this.userService.create(signUpDto);
  }

  private async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = await this.prisma.refreshToken.create({
      data: {
        userId,
        token: randomBytes(40).toString('hex'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    return refreshToken.token;
  }

  async signOut(refreshToken: string): Promise<{ message: string }> {
	try {
	  await this.prisma.refreshToken.delete({
		where: {
		  token: refreshToken
		}
	  });
	  return { message: 'Successfully logged out' };
	} catch (error) {
	  return { message: 'Logout successful' };
	}
  }

  async refreshToken(refresh_token: string) {
    const refreshTokenData = await this.prisma.refreshToken.findUnique({
      where: {
        token: refresh_token,
      },
      include: {
        user: true,
      },
    });

    if (!refreshTokenData || refreshTokenData.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = {
      userId: refreshTokenData.user.id,
      email: refreshTokenData.user.email,
      username: refreshTokenData.user.username,
      sub: refreshTokenData.user.id,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return { user: refreshTokenData.user, access_token };
  }
}
