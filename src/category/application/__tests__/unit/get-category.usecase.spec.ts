import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../../get-category.usecase";

describe("GetCategoryUsecase Integration tests", () => {
  let usecase: GetCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    usecase = new GetCategoryUseCase(categoryRepository);
  });

  it("should throws when a category is not found", async () => {
    const uuid = new Uuid();

    await expect(() => usecase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should get an existent category", async () => {
    const category = Category.create({ name: "Category 1" });
    const repositorySpy = jest.spyOn(categoryRepository, "findById");
    await categoryRepository.insert(category);
    const getCategory = await usecase.execute({ id: category.category_id.id });

    expect(repositorySpy).toHaveBeenCalledWith(category.category_id);
    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveReturnedTimes(1);
    expect(getCategory).toBeDefined();
    expect(getCategory).toEqual({
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
