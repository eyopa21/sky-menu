import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RedisService } from 'src/redis/redis.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const redisClient = this.redisService.getClient();
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalids token structure');
    }
    try {
      const resp = this.authService.validateToken(token);
      if (!resp) {
        throw new UnauthorizedException('Unauthorized Access');
      }
      const session = await redisClient.get(`access:${token}`);
      if (!session) throw new UnauthorizedException('Session expired');
      const user = await this.userService.findOneById(+resp.sub);
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        // Handle other potential errors
        throw new UnauthorizedException('Unauthorized Access');
      }
    }
  }
}
