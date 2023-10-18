export type CategoryConstructorProps = {
  category_id?: string;
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryCreateCommand = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export class Category {
  category_id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    this.category_id = props.category_id ?? undefined;
    this.name = props.name;
    this.description = props.description;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CategoryCreateCommand): Category {
    return new Category(props);
  }

  changeName(name: string): void {
    this.name = name;
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }
}
