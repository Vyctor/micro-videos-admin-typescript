import { Repository } from "../../shared/domain/repository/repository-interface";
import { Category } from "./category.entity";
import { Uuid } from "./value-objects/uuid.vo";

export interface CategoryRepository extends Repository<Category, Uuid> {}
