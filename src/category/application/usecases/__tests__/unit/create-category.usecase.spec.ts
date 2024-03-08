import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUsecase } from "../../create-category.usecase";

describe("CreateCategoryUsecase unit tests", () => {
  let usecase: CreateCategoryUsecase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    usecase = new CreateCategoryUsecase(categoryRepository);
  });

  it("should create a category", async () => {
    const spyInsert = jest.spyOn(categoryRepository, "insert");
    let output = await usecase.execute({ name: "Category 1" });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: categoryRepository.items[0].category_id.id,
      name: categoryRepository.items[0].name,
      description: categoryRepository.items[0].description,
      is_active: true,
      created_at: categoryRepository.items[0].created_at,
    });

    output = await usecase.execute({
      name: "Category 2",
      description: "Description 2",
      is_active: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: categoryRepository.items[1].category_id.id,
      name: categoryRepository.items[1].name,
      description: categoryRepository.items[1].description,
      is_active: false,
      created_at: categoryRepository.items[1].created_at,
    });
  });
});
