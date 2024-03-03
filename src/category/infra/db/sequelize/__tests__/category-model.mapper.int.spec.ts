import { Sequelize } from "sequelize-typescript";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model.mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { Category } from "../../../../domain/category.entity";

describe("CategoryModelMapper Integration Tests", () => {
  let sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
    });
    await sequelize.sync({ force: true });
  });

  it("should throw error when category is invalid", async () => {
    const model = CategoryModel.build({
      category_id: "9366b7f2-4f6f-4d3e-8f0e-2c3b7f3b6b9d",
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail("The category is valid, but it needs throws a LoadAggregateError");
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category aggregate to a category model", async () => {
    const category = Category.fake().aCategory().build();
    const model = CategoryModelMapper.toModel(category);
    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  it("should convert a category model to a category aggregate", async () => {
    const model = CategoryModel.build({
      category_id: "9366b7f2-4f6f-4d3e-8f0e-2c3b7f3b6b9d",
      name: "Category Name",
      description: "Category Description",
      is_active: true,
      created_at: new Date(),
    });
    const category = CategoryModelMapper.toEntity(model);
    expect(category).toMatchObject({
      category_id: {
        id: "9366b7f2-4f6f-4d3e-8f0e-2c3b7f3b6b9d",
      },
      name: "Category Name",
      description: "Category Description",
      is_active: true,
      created_at: model.created_at,
    });
  });
});
