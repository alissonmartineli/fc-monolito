import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ProductCheckoutModel } from "./product.model";
import { OrderProductModel } from "./order-product.model";
import { ClientCheckoutModel } from "./client.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientCheckoutModel)
  @Column
  declare clientId: string;

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: true })
  declare updatedAt: Date;

  @BelongsToMany(() => ProductCheckoutModel, () => OrderProductModel)
  declare products: ProductCheckoutModel[];

  @HasMany(() => OrderProductModel)
  declare orderProduct: OrderProductModel[];

  @BelongsTo(() => ClientCheckoutModel)
  declare client: ClientCheckoutModel;
}
