import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUsecase } from '@core/category/application/usecases/create-category/create-category.usecase';
import { UpdateCategoryUsecase } from '@core/category/application/usecases/update-category/update-category.usecase';
import { DeleteCategoryUsecase } from '@core/category/application/usecases/delete-category/delete-category.usecase';
import { GetCategoryUsecase } from '@core/category/application/usecases/get-category/get-category.usecase';
import { ListCategoriesUsecase } from '@core/category/application/usecases/list-categories/list-categories.usecase';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUsecase)
  private createCategoryUsecase: CreateCategoryUsecase;

  @Inject(UpdateCategoryUsecase)
  private updateCategoryUsecase: UpdateCategoryUsecase;

  @Inject(DeleteCategoryUsecase)
  private deleteCategoryUsecase: DeleteCategoryUsecase;

  @Inject(GetCategoryUsecase)
  private getCategoryUsecase: GetCategoryUsecase;

  @Inject(ListCategoriesUsecase)
  private listCategoriesUsecase: ListCategoriesUsecase;

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
