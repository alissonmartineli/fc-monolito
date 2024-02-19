import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { ProductCheckoutModel } from "./product.model";

@Table({
  tableName: "order-product",
  timestamps: false,
})
export class OrderProductModel extends Model {
  @ForeignKey(() => OrderModel)
  @Column
  declare orderId: string;

  @ForeignKey(() => ProductCheckoutModel)
  @Column
  declare productId: string;
}
