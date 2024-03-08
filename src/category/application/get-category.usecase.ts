import { Usecase } from "../../shared/application/usecase.interface";
import { NotFoundError } from "../../shared/domain/errors/not-found.error";
import { Category } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";
import { Uuid } from "../domain/value-objects/uuid.vo";

export type GetCategoryUsecaseInput = {
  id: string;
};
export type GetCategoryUsecaseOutput = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
};

export class GetCategoryUseCase
  implements Usecase<GetCategoryUsecaseInput, GetCategoryUsecaseOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    input: GetCategoryUsecaseInput
  ): Promise<GetCategoryUsecaseOutput> {
    const uuid = new Uuid(input.id);

    const category = await this.categoryRepository.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
