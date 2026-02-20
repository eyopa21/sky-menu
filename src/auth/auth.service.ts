import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'types/jwt-token';
import { RedisService } from 'src/redis/redis.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtService: JwtService,
    private readonly userService: UsersService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
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

  async register(createUserDto: any) {
    const user = await this.userService.create(createUserDto);
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    const redisClient = this.redisService.getClient();
    await redisClient.set(`access:${accessToken}`, user.id, { EX: 900 });
    await redisClient.set(`refresh:${refreshToken}`, user.id, { EX: 604800 });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = randomUUID();
    const redisClient = this.redisService.getClient();

    try {
      // Store reset token mapping to user ID for 1 hour
      await redisClient.set(`reset:${resetToken}`, user.id, { EX: 3600 });

      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/reset-password?token=${resetToken}`;

      await this.mailerService.sendMail(
        user.email,
        'Password Reset Request - SKy Menu',
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #10b981; margin-bottom: 16px;">Password Reset</h2>
          <p style="color: #4b5563; line-height: 1.6;">You've requested a password reset for your SKy Menu account. Click the button below to set a new password:</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; 2026 SKy Menu. Your Digital Menu Companion.</p>
        </div>
        `,
      );

      return { message: 'Reset link has been sent to your email.' };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new InternalServerErrorException('Failed to process password reset request.');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const redisClient = this.redisService.getClient();
    const userId = await redisClient.get(`reset:${token}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userService.updateUser(+userId, { password: hashedPassword });
    await redisClient.del(`reset:${token}`);

    return { message: 'Password has been successfully reset.' };
  }

  async changePassword(userId: number, newPassword: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userService.updateUser(userId, { password: hashedPassword });

    return { message: 'Password has been successfully updated.' };
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
