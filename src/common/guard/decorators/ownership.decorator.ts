import { SetMetadata, applyDecorators } from '@nestjs/common';
import { EntityTarget } from 'typeorm';

export function ApplyOwnershipMetadata<T = any>(
  entity: EntityTarget<T>,
  ownershipField: string,
  paramName: string = 'id',
): MethodDecorator {
  return applyDecorators(
    SetMetadata('ownership_entity', entity),
    SetMetadata('ownership_field', ownershipField),
    SetMetadata('ownership_param_name', paramName),
  );
}
