import { Usecase } from '../../../../shared/application/usecase.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/paginations-output';
import {
  CategoryFilter,
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export type ListCategoriesUsecaseInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
};

export type ListCategoriesUsecaseOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUsecase
  implements Usecase<ListCategoriesUsecaseInput, ListCategoriesUsecaseOutput>
{
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    input: ListCategoriesUsecaseInput,
  ): Promise<ListCategoriesUsecaseOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.categoryRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(
    searchResult: CategorySearchResult,
  ): ListCategoriesUsecaseOutput {
    const { items: _items } = searchResult;
    const items = _items.map((item) => {
      return CategoryOutputMapper.toOutput(item);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
