import { Entity } from "../../domain/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { Repository } from "../../domain/repository/repository-interface";
import { ValueObject } from "../../domain/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject
> implements Repository<E, EntityId>
{
  private items: Array<E> = new Array();

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
    return typeof item === "undefined" ? null : item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}
