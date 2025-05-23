import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'types/jwt-token';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtService: JwtService,
    private readonly userService: UsersService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
    private readonly redisService: RedisService,
  ) {}
  generateAccessToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.authJwtService.sign(payload, {
      secret: this.jwtConfigService.JWT_ACCESS_SECRET,
      expiresIn: '45m',
    });
  }
  generateRefreshToken(userId: number) {
    const payload = { sub: userId };
    return this.authJwtService.sign(payload, {
      secret: this.jwtConfigService.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);
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
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    const redisClient = this.redisService.getClient();

    await redisClient.set(`access:${accessToken}`, user.id, { EX: 900 }); // 15 min
    await redisClient.set(`refresh:${refreshToken}`, user.id, { EX: 604800 }); // 7 days

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
  validateToken(token: string) {
    try {
      const decoded = this.authJwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return decoded;
    } catch (e: any) {
      console.error(e);
      throw new UnauthorizedException('Invalid token');
    }
  }
  async validateRefreshToken(refreshToken: string) {
    const redisClient = this.redisService.getClient();
    try {
      const decoded = this.authJwtService.verify<Omit<JwtPayload, 'email'>>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      const user = await this.userService.findOneById(decoded.sub);
      const accessToken = this.generateAccessToken(user.id, user.email);
      await redisClient.set(`access:${accessToken}`, user.id, { EX: 900 });
      return {
        accessToken,
      };
    } catch (e: any) {
      console.error(e);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(accessToken: string, refreshToken: string) {
    const redisClient = this.redisService.getClient();
    await redisClient.del(`access:${accessToken}`);
    await redisClient.del(`refresh:${refreshToken}`);
  }
}
