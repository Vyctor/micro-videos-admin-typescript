import { InMemoryRepository } from "../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../domain/category.entity";
import { Uuid } from "../../domain/value-objects/uuid.vo";

export class CategoryInMemoryRepository extends InMemoryRepository<
  Category,
  Uuid
> {
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
