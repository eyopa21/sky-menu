import { Body, Controller, Param, Post, Patch, Request, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Request as ExpressRequest } from 'express';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Users } from 'src/users/entity/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogoutDto } from './dto/logout.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

  @ApiOperation({ summary: 'Signup', description: 'Registers a new user' })
  @Post('signup')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password', description: 'Initiates password recovery' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password', description: 'Resets password using a valid token' })
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-password')
  @ApiOperation({ summary: 'Change Password', description: 'Updates the password for the current user' })
  async changePassword(
    @Request() req: any,
    @Body('password') password: string,
  ) {
    const userId = req.user.id;
    return this.authService.changePassword(userId, password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: ExpressRequest) {
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
