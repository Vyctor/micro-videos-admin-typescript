import { CreateCategoryUsecase } from '@core/category/application/usecases/create-category/create-category.usecase';
import { DeleteCategoryUsecase } from '@core/category/application/usecases/delete-category/delete-category.usecase';
import { GetCategoryUsecase } from '@core/category/application/usecases/get-category/get-category.usecase';
import { ListCategoriesUsecase } from '@core/category/application/usecases/list-categories/list-categories.usecase';
import { UpdateCategoryUsecase } from '@core/category/application/usecases/update-category/update-category.usecase';
import { CategoryRepository } from '@core/category/domain/category.repository';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES = {
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    useExisting: CategorySequelizeRepository,
  },
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategorySequelizeRepository,
    useFactory: (categoryModel: typeof CategoryModel) => {
      return new CategorySequelizeRepository(categoryModel);
    },
    inject: [getModelToken(CategoryModel)],
  },
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUsecase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new CreateCategoryUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUsecase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new UpdateCategoryUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListCategoriesUsecase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new ListCategoriesUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUsecase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new GetCategoryUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUsecase,
    useFactory: (categoryRepo: CategoryRepository) => {
      return new DeleteCategoryUsecase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
