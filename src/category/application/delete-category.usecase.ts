import { Usecase } from "../../shared/application/usecase.interface";
import { CategoryRepository } from "../domain/category.repository";
import { Uuid } from "../domain/value-objects/uuid.vo";

export type DeleteCategoryUsecaseInput = {
  id: string;
};
export type DeleteCategoryUsecaseOutput = void;

export class DeleteCategoryUsecase
  implements Usecase<DeleteCategoryUsecaseInput, DeleteCategoryUsecaseOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    input: DeleteCategoryUsecaseInput
  ): Promise<DeleteCategoryUsecaseOutput> {
    const uuid = new Uuid(input.id);
    await this.categoryRepository.delete(uuid);
  }
}
