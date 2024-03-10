import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../../domain/category.entity";
import {
  CategoryFilter,
  CategoryRepository,
} from "../../../domain/category.repository";
import { Uuid } from "../../../domain/value-objects/uuid.vo";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements CategoryRepository
{
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter
  ): Promise<Category[]> {
    if (!filter) return Promise.resolve(items);
    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Array<Category> {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "created_at", "desc");
  }
}
