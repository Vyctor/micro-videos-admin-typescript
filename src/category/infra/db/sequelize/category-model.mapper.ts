import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";
import { Uuid } from "../../../domain/value-objects/uuid.vo";

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    const model = new CategoryModel({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
    return model;
  }

  static toEntity(model: CategoryModel): Category {
    const entity = new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });
    Category.validate(entity);
    return entity;
  }
}
