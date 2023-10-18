import { Category } from "../category.entity";
import { Uuid } from "../value-objects/uuid.vo";

describe("Category Unit Tests", () => {
  it("should create a category", () => {
    const uuid = new Uuid();

    let category = new Category({
      name: "Movie",
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      is_active: false,
      description: "Movie Description",
      created_at: new Date("2021-01-01"),
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      category_id: uuid,
      name: "Movie",
      is_active: false,
      description: "Movie Description",
      created_at: new Date("2021-01-01"),
    });

    expect(category.category_id).toBe(uuid);
    expect(category.name).toBe("Movie");
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should change category name", () => {
    const category = new Category({
      name: "Movie",
    });
    category.changeName("Music");
    expect(category.name).toBe("Music");
  });

  it("should change category description", () => {
    const category = new Category({
      name: "Movie",
    });
    category.changeDescription("Music Description");
    expect(category.description).toBe("Music Description");
  });

  it("should activate category", () => {
    const category = new Category({
      name: "Movie",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  it("should deactivate category", () => {
    const category = new Category({
      name: "Movie",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });

  it.each([
    {
      category_id: null,
    },
    { category_id: undefined },
    { category_id: new Uuid() },
  ])("id = %j", (value) => {
    const category = new Category({
      name: "Movie",
      category_id: value.category_id as any,
    });
    expect(category.category_id).toBeInstanceOf(Uuid);
  });
});
