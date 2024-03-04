import { Usecase } from "../../shared/application/usecase.interface";
import { NotFoundError } from "../../shared/domain/errors/not-found.error";
import { Category } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";
import { Uuid } from "../domain/value-objects/uuid.vo";

export type UpdateCategoryUsecaseInput = {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
};

export type UpdateCategoryUsecaseOutput = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
};

export class UpdateCategoryUsecase
  implements Usecase<UpdateCategoryUsecaseInput, UpdateCategoryUsecaseOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    input: UpdateCategoryUsecaseInput
  ): Promise<UpdateCategoryUsecaseOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    if (input.description) {
      category.changeDescription(input.description);
    }

    input.is_active ? category.activate() : category.deactivate();

    await this.categoryRepository.update(category);

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
