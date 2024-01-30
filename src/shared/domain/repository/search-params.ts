import { ValueObject } from "../value-object";

export type SortDirection = "asc" | "desc";

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_direction?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> extends ValueObject {
  protected _page: number;
  protected _per_page: number;
  protected _sort: string | null;
  protected _sort_direction: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    super();
    this._page = props.page || 1;
    this._per_page = props.per_page || 10;
    this._sort = props.sort || null;
    this._sort_direction = props.sort_direction || null;
    this._filter = props.filter || null;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get per_page(): number {
    return this._per_page;
  }

  private set per_page(value: number) {
    let _per_page = value === (true as any) ? this._per_page : +value;

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }
    this._per_page = _per_page;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === "" ? null : `${value}`;
  }

  get sort_direction(): SortDirection | null {
    return this._sort_direction;
  }

  private set sort_direction(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_direction = null;
      return;
    }
    const direction = `${value}`.toLowerCase();
    this._sort_direction =
      direction !== "asc" && direction !== "desc" ? "asc" : direction;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  protected set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || (value as unknown) === ""
        ? null
        : (`${value}` as any);
  }
}
