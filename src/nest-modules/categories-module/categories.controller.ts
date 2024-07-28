import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUsecase } from '@core/category/application/usecases/create-category/create-category.usecase';
import { UpdateCategoryUsecase } from '@core/category/application/usecases/update-category/update-category.usecase';
import { DeleteCategoryUsecase } from '@core/category/application/usecases/delete-category/delete-category.usecase';
import { GetCategoryUsecase } from '@core/category/application/usecases/get-category/get-category.usecase';
import { ListCategoriesUsecase } from '@core/category/application/usecases/list-categories/list-categories.usecase';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { CategoryOutput } from '@core/category/application/usecases/common/category-output';
import { SearchCategoriesDto } from './dto/search-categories.dto';

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
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryPresenter> {
    const output = await this.createCategoryUsecase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchCategoriesDto) {
    const output = await this.listCategoriesUsecase.execute(searchParamsDto);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: 422,
      }),
    )
    id: string,
  ) {
    const output = await this.getCategoryUsecase.execute({
      id,
    });

    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: 422,
      }),
    )
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CreateCategoryDto> {
    const output = await this.updateCategoryUsecase.execute({
      ...updateCategoryDto,
      id,
    });

    return CategoriesController.serialize(output);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: 422,
      }),
    )
    id: string,
  ): Promise<void> {
    await this.deleteCategoryUsecase.execute({
      id,
    });
  }

  static serialize(output: CategoryOutput): CategoryPresenter {
    return new CategoryPresenter(output);
  }
}
