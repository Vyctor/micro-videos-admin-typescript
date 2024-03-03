import { Error } from "sequelize";
import { Entity } from "../../../../shared/domain/entity";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Category } from "../../../domain/category.entity";
import { CategoryRepository } from "../../../domain/category.repository";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      created_at: entity.created_at,
      is_active: entity.is_active,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((entity) => ({
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        created_at: entity.created_at,
        is_active: entity.is_active,
      }))
    );
  }

  async update(entity: Category): Promise<void> {
    await this.categoryModel.update(
      {
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
      },
      { where: { category_id: entity.category_id.id } }
    );
  }

  async delete(entity_id: Uuid): Promise<void> {
    await this.categoryModel.destroy({ where: { category_id: entity_id.id } });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id);
    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      created_at: model.created_at,
      is_active: model.is_active,
    });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map(
      (model) =>
        new Category({
          category_id: new Uuid(model.category_id),
          name: model.name,
          description: model.description,
          created_at: model.created_at,
          is_active: model.is_active,
        })
    );
  }

  async getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(params: SearchParams<string>): Promise<SearchResult<Entity>> {}
}
