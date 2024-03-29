import { Usecase } from '../../../../shared/application/usecase.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Category } from '../../../domain/category.entity';
import { CategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutputMapper,
  CategoryOutput,
} from '../common/category-output';
import { CreateCategoryInput } from './create-category.input';

export class CreateCategoryUsecase
  implements Usecase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = Category.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.categoryRepo.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }
}

export type CreateCategoryOutput = CategoryOutput;
