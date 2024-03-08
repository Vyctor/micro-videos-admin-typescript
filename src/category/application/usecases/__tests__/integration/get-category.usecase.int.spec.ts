import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { GetCategoryUseCase } from "../../get-category.usecase";

describe("DeleteCategoryUsecase Integration tests", () => {
  let usecase: GetCategoryUseCase;
  let categoryRepository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
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
    await categoryRepository.insert(category);

    const repositorySpy = jest.spyOn(categoryRepository, "findById");
    const getCategory = await usecase.execute({ id: category.category_id.id });

    expect(repositorySpy).toHaveBeenCalledWith({
      id: category.category_id.id,
    });
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
