import { Usecase } from '../../../../shared/application/usecase.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Category } from '../../../domain/category.entity';
import { CategoryRepository } from '../../../domain/category.repository';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export type GetCategoryUsecaseInput = {
  id: string;
};

export class GetCategoryUseCase
  implements Usecase<GetCategoryUsecaseInput, CategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: GetCategoryUsecaseInput): Promise<CategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.findById(uuid);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }
    return CategoryOutputMapper.toOutput(category);
  }
}
