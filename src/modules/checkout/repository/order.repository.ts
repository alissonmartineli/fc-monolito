import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import type CheckoutGateway from "../gateway/checkout.gateway";
import { ClientCheckoutModel } from "./client.model";
import { OrderProductModel } from "./order-product.model";
import { OrderModel } from "./order.model";
import { ProductCheckoutModel } from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order) {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        status: order.status,
        createdAt: order.createdAt,
        orderProduct: order.products.map((p) => ({
          productId: p.id.id,
        })),
      },
      {
        include: [OrderProductModel],
      }
    );
  }

  async findOrder(id: string) {
    const order = await OrderModel.findOne({
      where: { id },
      include: [ProductCheckoutModel, ClientCheckoutModel],
    });

    if (order === null) {
      return null;
    }

    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.clientId),
        name: order.client.name,
        email: order.client.email,
        address: new Address(
          order.client.street,
          order.client.number,
          order.client.complement,
          order.client.city,
          order.client.state,
          order.client.zipcode
        ),
      }),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      products: order.products.map(
        (p) =>
          new Product({
            id: new Id(p.id),
            name: p.name,
            description: p.description,
            salesPrice: p.salesPrice,
          })
      ),
    });
  }
}
