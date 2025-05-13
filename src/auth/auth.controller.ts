import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) { }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }


    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() req: Request){
        return req.user
    }

    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
      return this.authService.validateRefreshToken(refreshTokenDto.refreshToken);
    }
    
}
