import { Usecase } from "../../shared/application/usecase.interface";
import { Category } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";

export type CreateCategoryUsecaseInput = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type CreateCategoryUsecaseOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at: Date;
};

export class CreateCategoryUsecase
  implements Usecase<CreateCategoryUsecaseInput, CreateCategoryUsecaseOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    input: CreateCategoryUsecaseInput
  ): Promise<CreateCategoryUsecaseOutput> {
    const entity = Category.create(input);
    await this.categoryRepository.insert(entity);
    return {
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    };
  }
}
