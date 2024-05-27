import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { AddCategoryDto } from './dto/add-category';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(addCategoryDto: AddCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryModel.findOne({
      title: addCategoryDto.title,
    });
    if (existingCategory) {
      throw new BadRequestException('This category is already exists');
    }
    return await this.categoryModel.create(addCategoryDto);
  }

  async findAllCategory(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }
}
