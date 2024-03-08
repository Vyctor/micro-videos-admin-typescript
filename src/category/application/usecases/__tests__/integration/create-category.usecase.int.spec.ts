import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CreateCategoryUsecase } from "../../create-category.usecase";

describe("CreateCategoryUsecase Integration tests", () => {
  let usecase: CreateCategoryUsecase;
  let categoryRepository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    usecase = new CreateCategoryUsecase(categoryRepository);
  });

  it("should create a category", async () => {
    const spyInsert = jest.spyOn(categoryRepository, "insert");
    let output = await usecase.execute({ name: "Category 1" });
    let entity = await categoryRepository.findById(new Uuid(output.id));
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: true,
      created_at: entity.created_at,
    });

    output = await usecase.execute({
      name: "Category 2",
      description: "Description 2",
      is_active: false,
    });

    entity = await categoryRepository.findById(new Uuid(output.id));

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: false,
      created_at: entity.created_at,
    });
  });
});
