import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  it("should create a category", () => {
    let category = new Category({
      name: "Movie",
    });

    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe("Movie");
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      is_active: false,
      description: "Movie Description",
      created_at: new Date("2021-01-01"),
    });

    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe("Movie");
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      category_id: "1",
      name: "Movie",
      is_active: false,
      description: "Movie Description",
      created_at: new Date("2021-01-01"),
    });

    expect(category.category_id).toBe("1");
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
});
