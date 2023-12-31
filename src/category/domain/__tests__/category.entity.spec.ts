import { Category } from "../category.entity";
import { Uuid } from "../value-objects/uuid.vo";

describe("Category Unit Tests", () => {
  let validateSpy: any;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  it("should create a category", () => {
    const category = Category.create({
      name: "Movie",
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
    expect(validateSpy).toBeCalledTimes(1);
  });

  it("should change category name", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeName("Music");
    expect(category.name).toBe("Music");
    expect(validateSpy).toBeCalledTimes(2);
  });

  it("should change category description", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeDescription("Music Description");
    expect(category.description).toBe("Music Description");
    expect(validateSpy).toBeCalledTimes(2);
  });

  it("should activate category", () => {
    const category = Category.create({
      name: "Movie",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBeTruthy();
    expect(validateSpy).toBeCalledTimes(1);
  });

  it("should deactivate category", () => {
    const category = Category.create({
      name: "Movie",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
    expect(validateSpy).toBeCalledTimes(1);
  });

  it("should update category", () => {
    const category = Category.create({
      name: "Movie",
      description: "Movie Description",
    });

    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie Description");

    category.update({
      name: "Music",
      description: "Music Description",
    });
    expect(category.name).toBe("Music");
    expect(category.description).toBe("Music Description");
    expect(validateSpy).toHaveBeenCalledTimes(3);
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

describe("Category Validator", () => {
  describe("create command", () => {
    it("should in invalid category with name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        Category.create({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
  });
});
