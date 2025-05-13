import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Users } from 'src/users/entity/user.entity';
import { DataSource, EntityTarget } from 'typeorm';


@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;
 

    if (!user) throw new UnauthorizedException('User not authenticated');

    // Get metadata from decorator
    const entity = this.reflector.get<EntityTarget<any>>('ownership_entity', context.getHandler());
    const ownershipField = this.reflector.get<string>('ownership_field', context.getHandler());


    console.log(user)

    if (!entity || !ownershipField) {
      throw new Error('OwnershipGuard requires @CheckOwnership metadata');
    }

    const repo = this.dataSource.getRepository(entity);
    const resource = await repo.findOne({
      where: { id: +resourceId },
      // relations: [ownershipField], // eager load the owner relation
    });

  
    if (!resource) {
      throw new ForbiddenException('Resource not found');
    }

    // const owner = resource[ownershipField];
    // const ownerId = typeof owner === 'object' ? owner.id : owner;
    const ownerId =  resource instanceof Users ? resource.id : resource.userId




    if (user.id !== ownerId) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
