import { Category } from "../../../../domain/category.entity";
import { CategorySearchResult } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CategoryOutputMapper } from "../../common/category-output";
import { ListCategoriesUsecase } from "../list-categories.usecase";

describe("LietCategoriesUsecase unit tests", () => {
  let usecase: ListCategoriesUsecase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    usecase = new ListCategoriesUsecase(categoryRepository);
  });

  it("should work toOutput method", () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    let output = usecase["toOutput"](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });

    const entity = Category.create({ name: "Category 1" });
    result = new CategorySearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = usecase["toOutput"](result);

    expect(output).toStrictEqual({
      items: [entity].map(CategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 2,
    });
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const items = [
      new Category({ name: "Category 1" }),
      new Category({
        name: "Category 2",
        created_at: new Date(new Date().getTime() + 100),
      }),
    ];
    categoryRepository.items = items;

    const output = await usecase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  it("should return output using pagination, sort and filter", async () => {
    const items = [
      new Category({ name: "a" }),
      new Category({ name: "AAA" }),
      new Category({ name: "AaA" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];

    categoryRepository.items = items;

    let output = await usecase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });

    output = await usecase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output).toStrictEqual({
      items: [items[0]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      last_page: 2,
      per_page: 2,
    });
  });
});
