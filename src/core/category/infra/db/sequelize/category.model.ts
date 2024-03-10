import { Model } from 'sequelize-typescript';
import { Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';

export type CategoryModelProps = {
  category_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  is_active: boolean;
};

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, primaryKey: true })
  declare category_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare created_at: Date;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;
}
