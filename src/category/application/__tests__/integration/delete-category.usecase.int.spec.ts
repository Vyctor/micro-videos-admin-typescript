import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { DeleteCategoryUsecase } from "../../delete-category.usecase";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Category } from "../../../domain/category.entity";

describe("DeleteCategoryUsecase Integration tests", () => {
  let usecase: DeleteCategoryUsecase;
  let categoryRepository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    usecase = new DeleteCategoryUsecase(categoryRepository);
  });

  it("should throws when a category is not found", async () => {
    const uuid = new Uuid();

    await expect(() => usecase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should delete a category", async () => {
    const category = Category.create({ name: "Category 1" });
    await categoryRepository.insert(category);

    let categoryToBeDeleted = await categoryRepository.findById(
      category.category_id
    );

    expect(categoryToBeDeleted).toBeInstanceOf(Category);
    expect(categoryToBeDeleted.category_id.id).toEqual(category.category_id.id);

    await usecase.execute({ id: category.category_id.id });

    categoryToBeDeleted = await categoryRepository.findById(
      category.category_id
    );

    expect(categoryToBeDeleted).toBeNull();
  });
});
