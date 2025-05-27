/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Users } from 'src/users/entity/user.entity';
import { DataSource, EntityTarget } from 'typeorm';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as Users;
    const resourceId = request.params.id;

    if (!user) throw new UnauthorizedException('User not authenticated');

    // Get metadata from decorator
    const entity = this.reflector.get<EntityTarget<any>>(
      'ownership_entity',
      context.getHandler(),
    );
    const ownershipField = this.reflector.get<string>(
      'ownership_field',
      context.getHandler(),
    );

    if (!entity || !ownershipField) {
      throw new Error('OwnershipGuard requires @CheckOwnership metadata');
    }

    try {
      this.dataSource.getMetadata(entity); // will throw if not an entity

      const repo = this.dataSource.getRepository(entity);

      console.log(entity === Users, entity);

      const resource = await repo.findOne({
        where: { id: +resourceId },
        relations: entity === Users ? [] : [ownershipField], // eager load the owner relation
      });

      function getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((o, key) => o?.[key], obj);
      }

      if (!resource) {
        throw new NotFoundException('Resource not found');
      }

      const owner = getNestedValue(resource, ownershipField);
      const ownerId =
        entity === Users
          ? resource.id
          : typeof owner === 'object'
            ? owner.id
            : owner;
      if (user.id !== ownerId) {
        throw new ForbiddenException('You do not own this resource');
      }

      return true;
    } catch (err) {
      console.log(err)
      return false;
    }
  }
}
