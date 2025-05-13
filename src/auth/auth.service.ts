import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'types/jwt-token';

@Injectable()
export class AuthService {
    constructor(
        private readonly authJwtService: JwtService,
        private readonly userService: UsersService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfigService: ConfigType<typeof jwtConfig>
    ) {}
    async generateAccessToken(userId: number, email: string) {
        const payload = { sub: userId, email };
        return this.authJwtService.sign(payload, {
            secret: this.jwtConfigService.JWT_ACCESS_SECRET,
            expiresIn: '45m'
        });
    }
    async generateRefreshToken(userId: number) {
        const payload = { sub: userId };
        return this.authJwtService.sign(payload, {
            secret: this.jwtConfigService.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
    }
    async login(loginDto: LoginDto) {
        const user = await this.userService.findUserByEmail(loginDto.email)
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const isCorrectPassword = await bcrypt.compare(
            loginDto.password,
            user.password,
        );
        if (!isCorrectPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.generateAccessToken(user.id, user.email)
        const refreshToken = await this.generateRefreshToken(user.id)
        return {
            accessToken,
            refreshToken,
            user
        }
    }
    async validateToken(token: string) {
        try {
            const decoded = this.authJwtService.verify<JwtPayload>(token, {
                secret: process.env.JWT_ACCESS_SECRET
            });
            return decoded;
        } catch (e: any) {
            console.error(e);
            throw new UnauthorizedException('Invalid token');
        }
    }
    async validateRefreshToken(refreshToken: string) {
        try {
            const decoded = this.authJwtService.verify<Omit<JwtPayload, 'email'>>(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });
            const user = await this.userService.findOneById(decoded.sub)
            const accessToken = await this.generateAccessToken(user.id, user.email)
            return {
                accessToken
            };
        } catch (e: any) {
            console.error(e);
            throw new UnauthorizedException('Invalid token');
        }
    }


    
}
