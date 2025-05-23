import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Users } from 'src/users/entity/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login', description: 'Generates a jwt token' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user as Users;
  }

  @Post('refresh')
  
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.validateRefreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout',
    description: 'Invalidates the jwt token and removes from session',
  })
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(
      logoutDto.accessToken,
      logoutDto.refreshToken,
    );
  }
}
