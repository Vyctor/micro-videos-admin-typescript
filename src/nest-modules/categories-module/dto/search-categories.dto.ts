import { SortDirection } from '@core/shared/domain/repository/search-params';
import { ListCategoriesUsecaseInput } from '../../../core/category/application/usecases/list-categories/list-categories.usecase';

export class SearchCategoriesDto implements ListCategoriesUsecaseInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
