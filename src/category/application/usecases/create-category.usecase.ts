import { Usecase } from "../../../shared/application/usecase.interface";
import { Category } from "../../domain/category.entity";
import { CategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

export type CreateCategoryUsecaseInput = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class CreateCategoryUsecase
  implements Usecase<CreateCategoryUsecaseInput, CategoryOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryUsecaseInput): Promise<CategoryOutput> {
    const entity = Category.create(input);
    await this.categoryRepository.insert(entity);
    return CategoryOutputMapper.toOutput(entity);
  }
}
