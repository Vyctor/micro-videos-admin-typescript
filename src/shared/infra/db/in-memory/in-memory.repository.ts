import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import {
  Repository,
  SearcheableRepository,
} from "../../../domain/repository/repository-interface";
import {
  SearchParams,
  SortDirection,
} from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements Repository<E, EntityId>
{
  protected items: Array<E> = new Array();

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id)
    );

    if (index === -1)
      throw new NotFoundError(entity.entity_id, this.getEntity());

    this.items[index] = entity;
  }

  async delete(id: EntityId): Promise<void> {
    const index = this.items.findIndex((item) => item.entity_id.equals(id));
    if (index === -1) throw new NotFoundError(id, this.getEntity());
    this.items.splice(index, 1);
  }

  async findById(entity_id: EntityId): Promise<E> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));
    return item ?? null;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearcheableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
  >
  extends InMemoryRepository<E, EntityId>
  implements SearcheableRepository<E, EntityId, Filter>
{
  sortableFields: string[];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir
    );
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page
    );
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null
  ): Promise<Array<E>>;

  protected applyPaginate(
    items: Array<E>,
    page: SearchParams["page"],
    per_page: SearchParams["per_page"]
  ) {
    const start = (page - 1) * per_page;
    const limit = start + per_page;
    return items.slice(start, limit);
  }

  protected applySort(
    items: Array<E>,
    sort: string | null,
    sort_dir: SortDirection,
    customer_getter?: (sort: string, item: E) => any
  ) {
    if (!sort || !this.sortableFields.includes(sort)) return items;

    return [...items].sort((a, b) => {
      // @ts-ignore
      const aValue = customer_getter ? customer_getter(sort, a) : a[sort];
      // @ts-ignore
      const bValue = customer_getter ? customer_getter(sort, b) : b[sort];

      if (aValue > bValue) {
        return sort_dir === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
}
