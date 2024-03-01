import { Model } from "sequelize-typescript";
import { Column, DataType, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "categories", timestamps: false })
export class CategoryModel extends Model {
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
