import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    
  ){}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {


    
    const request = context.switchToHttp().getRequest<Request>()

    const  {authorization} = request.headers  
      
    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid or Expired token');
    }
    try {
      const resp = await this.authService.validateToken(token);
      if (!resp) {
        throw new UnauthorizedException('Unauthorized Access');
      }

      console.log(resp)
      // const user = await this.authService.getMe(+resp.sub);
      // request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Token validation failed');
      } else {
        // Handle other potential errors
        throw new UnauthorizedException('Unauthorized Access');
      }
    }

    return true;
  }
}
