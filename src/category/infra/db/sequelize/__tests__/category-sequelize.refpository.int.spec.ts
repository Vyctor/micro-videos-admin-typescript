import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { Category } from "../../../../domain/category.entity";

describe("CategorySequelizeRepository Integration Test", () => {
  let sequelize;
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
    });
    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should insert a new category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const model = await CategoryModel.findByPk(category.category_id.id);
    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  it("should bulk insert categories", async () => {
    const categories = [];
    for (let i = 0; i < 3; i++) {
      categories.push(Category.fake().aCategory().build());
    }
    await repository.bulkInsert(categories);
    const models = await CategoryModel.findAll();
    expect(models).toHaveLength(3);
    expect(models.map((model) => model.toJSON())).toMatchObject(
      categories.map((category) => ({
        category_id: category.category_id.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
      }))
    );
  });

  it("should update a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    category.name = "new name";
    category.description = "new description";
    category.is_active = false;
    category.created_at = new Date();
    await repository.update(category);
    const model = await CategoryModel.findByPk(category.category_id.id);
    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  it("should throw an error when updating a category that does not exist", async () => {
    const category = Category.fake().aCategory().build();
    await expect(repository.update(category)).rejects.toThrow();
  });

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await repository.delete(category.category_id);
    const model = await CategoryModel.findByPk(category.category_id.id);
    expect(model).toBeNull();
  });

  it("should throw an error when deleting a category that does not exist", async () => {
    const category = Category.fake().aCategory().build();
    await expect(repository.delete(category.category_id)).rejects.toThrow();
  });

  it("should find a category by id", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const found = await repository.findById(category.category_id);
    expect(found).toMatchObject(category);
  });

  it("should return null when finding a category by id that does not exist", async () => {
    const category = Category.fake().aCategory().build();
    const found = await CategoryModel.findByPk(category.category_id.id);
    expect(found).toBeNull();
  });

  it("should find all categories", async () => {
    const categories = [];

    for (let i = 0; i < 3; i++) {
      categories.push(Category.fake().aCategory().build());
    }
    await repository.bulkInsert(categories);
    const found = await repository.findAll();
    expect(found).toHaveLength(3);
    expect(found).toMatchObject(categories);
  });

  it("should return an empty array when finding all categories and there are no categories", async () => {
    const found = await repository.findAll();
    expect(found).toHaveLength(0);
  });

  it("should return entity name", () => {
    expect(repository.getEntity()).toBe(Category);
  });
});
