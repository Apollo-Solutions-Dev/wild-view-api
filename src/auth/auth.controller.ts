import { Body, Controller, HttpCode, HttpStatus, Post  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  signOut(@Body() body: { refreshToken: string }) {
    return this.authService.signOut(body.refreshToken);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    const { user, access_token } = await this.authService.refreshToken(
      body.refreshToken,
    );
    return { user, access_token };
  }


}
