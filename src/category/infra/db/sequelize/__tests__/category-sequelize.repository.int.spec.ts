import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category-sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { CategoryModelMapper } from "../category-model.mapper";
import {
  CategorySearchParams,
  CategorySearchResult,
} from "../../../../domain/category.repository";

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

  describe("search method tests", () => {
    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName("Movie")
        .withDescription(null)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");

      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.category_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          is_active: true,
          created_at: created_at,
        })
      );
    });

    it("should order by created_at DESC when Search params are null", async () => {
      const created_at = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();
      const searchOutput = await repository.search(new CategorySearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`);
      });
    });

    it("should apply paginate and filter", async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName("test")
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("a")
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TEST")
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName("TeSt")
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(categories);

      let searchOutput = await repository.search(
        new CategorySearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true)
      );

      searchOutput = await repository.search(
        new CategorySearchParams({
          page: 2,
          per_page: 2,
          filter: "TEST",
        })
      );

      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true)
      );
    });

    it("should apply paginate and sort", async () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

      const categories = [
        Category.fake().aCategory().withName("b").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("d").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("c").build(),
      ];
      await repository.bulkInsert(categories);

      const arrange = [
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe("should search using filter, sort and paginate", () => {
      const categories = [
        Category.fake().aCategory().withName("test").build(),
        Category.fake().aCategory().withName("a").build(),
        Category.fake().aCategory().withName("TEST").build(),
        Category.fake().aCategory().withName("e").build(),
        Category.fake().aCategory().withName("TeSt").build(),
      ];

      const arrange = [
        {
          search_params: new CategorySearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CategorySearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          search_result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(categories);
      });

      test.each(arrange)(
        "when value is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        }
      );
    });
  });
});
