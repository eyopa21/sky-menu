import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateCategoryDto } from './createCategory.dto';

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['projectId'] as const),
) {}
