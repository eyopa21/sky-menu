import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateMenuItemDto } from "./createMenuItem.dto";

export class UpdateMenuItemDto extends PartialType(
    OmitType(CreateMenuItemDto, ['menuId'] as const)
){}