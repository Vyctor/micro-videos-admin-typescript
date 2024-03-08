import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import {
  InvalidUUidError,
  Uuid,
} from "../../../../domain/value-objects/uuid.vo";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { UpdateCategoryUsecase } from "../../update-category.usecase";

describe("UpdateCategoryUsecase integration tests", () => {
  let usecase: UpdateCategoryUsecase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    usecase = new UpdateCategoryUsecase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      usecase.execute({ id: "fake_id", name: "fake" })
    ).rejects.toThrow(new InvalidUUidError());

    const uuid = new Uuid();

    await expect(() =>
      usecase.execute({ id: uuid.id, name: "fake" })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it("should update category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");

    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
    });
    await repository.insert(category);

    let usecaseResponse = await usecase.execute({
      id: category.category_id.id,
      name: "Category 1 updated",
      description: "Category 1 description updated",
      is_active: true,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(usecaseResponse).toStrictEqual({
      id: category.category_id.id,
      name: "Category 1 updated",
      description: "Category 1 description updated",
      is_active: true,
      created_at: category.created_at,
    });

    usecaseResponse = await usecase.execute({
      id: category.category_id.id,
      name: "Category 1 updated again",
      is_active: false,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(2);
    expect(usecaseResponse).toStrictEqual({
      id: category.category_id.id,
      name: "Category 1 updated again",
      description: "Category 1 description updated",
      is_active: false,
      created_at: category.created_at,
    });

    usecaseResponse = await usecase.execute({
      id: category.category_id.id,
      description: "Category 1 description updated again",
    });

    expect(spyUpdate).toHaveBeenCalledTimes(3);
    expect(usecaseResponse).toStrictEqual({
      id: category.category_id.id,
      name: "Category 1 updated again",
      description: "Category 1 description updated again",
      is_active: false,
      created_at: category.created_at,
    });

    usecaseResponse = await usecase.execute({
      id: category.category_id.id,
      name: "Category 1 updated again again",
      description: undefined,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(4);
    expect(usecaseResponse).toStrictEqual({
      id: category.category_id.id,
      name: "Category 1 updated again again",
      description: "Category 1 description updated again",
      is_active: false,
      created_at: category.created_at,
    });
  });
});
