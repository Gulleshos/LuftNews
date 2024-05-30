import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../user/role.enum';
import { AddCategoryDto } from './dto/add-category';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles([RoleEnum.ADMIN])
  async addCategory(@Body() addCategoryDto: AddCategoryDto) {
    return await this.categoryService.createCategory(addCategoryDto);
  }

  @Get()
  async getAllCategories() {
    return await this.categoryService.findAllCategory();
  }
}
