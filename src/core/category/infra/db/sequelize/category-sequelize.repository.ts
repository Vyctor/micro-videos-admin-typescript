import { Category } from '../../../domain/category.entity';
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/category.repository';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { CategoryModel } from './category.model';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Op } from 'sequelize';
import { CategoryModelMapper } from './category-model.mapper';

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(model.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const models = entities.map((entity) =>
      CategoryModelMapper.toModel(entity),
    );
    await this.categoryModel.bulkCreate(models.map((model) => model.toJSON()));
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const modelProps = CategoryModelMapper.toModel(entity);
    const [affectedRows] = await this.categoryModel.update(
      modelProps.toJSON(),
      {
        where: { category_id: entity.category_id.id },
      },
    );
    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async delete(entity_id: Uuid): Promise<void> {
    const id = entity_id.id;
    const affectedRows = await this.categoryModel.destroy({
      where: { category_id: id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id);
    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => CategoryModelMapper.toEntity(model));
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
        : { order: [['created_at', 'desc']] }),
      offset,
      limit,
    });

    return new CategorySearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
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
