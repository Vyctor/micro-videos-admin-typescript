import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { Category } from "../../../../domain/category.entity";
import { Config } from "../../../../../shared/infra/config";
import { set } from "lodash";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategoryModel], logging: true });

  it("should mapping props", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    expect(attributes).toEqual([
      "category_id",
      "name",
      "description",
      "created_at",
      "is_active",
    ]);
    const categoryIdAttr = attributesMap.category_id;

    expect(categoryIdAttr).toMatchObject({
      field: "category_id",
      fieldName: "category_id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      allowNull: false,
      type: DataType.DATE(3),
    });

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });
  });

  it("should create a category", async () => {
    const fakeCategory = Category.fake().aCategory().build();
    await CategoryModel.create({
      category_id: fakeCategory.category_id.id,
      name: fakeCategory.name,
      description: fakeCategory.description,
      created_at: fakeCategory.created_at,
      is_active: fakeCategory.is_active,
    });

    const createdCategory = await CategoryModel.findOne({
      where: { category_id: fakeCategory.category_id.id },
    });
    expect(createdCategory.category_id).toBe(fakeCategory.category_id.id);
    expect(createdCategory.name).toBe(fakeCategory.name);
    expect(createdCategory.description).toBe(fakeCategory.description);
    expect(createdCategory.created_at.toString()).toBe(
      fakeCategory.created_at.toString()
    );
    expect(createdCategory.is_active).toBe(fakeCategory.is_active);
  });
});
