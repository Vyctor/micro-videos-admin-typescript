import { Error } from "sequelize";
import { Entity } from "../../../../shared/domain/entity";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Category } from "../../../domain/category.entity";
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from "../../../domain/category.repository";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { CategoryModel } from "./category.model";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { Op } from "sequelize";

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
    const id = entity.category_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.categoryModel.update(
      {
        category_id: entity.category_id.id,
        name: entity.name,
        description: entity.description,
        created_at: entity.created_at,
        is_active: entity.is_active,
      },
      {
        where: { category_id: id },
      }
    );
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }
    await this.categoryModel.destroy({ where: { category_id: id } });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this._get(entity_id.id);
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

  async search(params: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (params.page - 1) * params.per_page;
    const limit = params.per_page;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(params.filter && {
        where: {
          name: { [Op.like]: `%${params.filter}%` },
        },
      }),
      ...(params.sort && this.sortableFields.includes(params.sort)
        ? { order: [[params.sort, params.sort_dir]] }
        : { order: [["created_at", "desc"]] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map(
        (model) =>
          new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            created_at: model.created_at,
            is_active: model.is_active,
          })
      ),
      current_page: params.page,
      per_page: params.per_page,
      total: count,
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  private async _get(id: string) {
    return await this.categoryModel.findByPk(id);
  }
}
