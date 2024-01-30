import { Entity } from "../entity";
import { ValueObject } from "../value-object";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface Repository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: EntityId): Promise<void>;
  findById(entity_id: EntityId): Promise<E>;
  findAll(): Promise<E[]>;
  getEntity(): new (...args: any[]) => E;
}

export interface SearcheableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  SearchInput = SearchParams,
  SearchOutput = SearchResult
> extends Repository<E, EntityId> {
  sortableFields: string[];
  search(params: SearchInput): Promise<SearchOutput>;
}
