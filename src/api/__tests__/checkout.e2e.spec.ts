import express, { type Express } from "express";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { type Umzug } from "umzug";
import { ClientCheckoutModel } from "../../modules/checkout/repository/client.model";
import { OrderProductModel } from "../../modules/checkout/repository/order-product.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { ProductCheckoutModel } from "../../modules/checkout/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import ProductCatalogModel from "../../modules/store-catalog/repository/product.model";
import { checkoutRoute } from "../routes/checkout.route";
import { clientRoute } from "../routes/clients.route";
import { productRoute } from "../routes/products.route";
import { migrator } from "../../config-migrations/migrator";

describe("E2E test for checkout", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/products", productRoute);
  app.use("/clients", clientRoute);
  app.use("/checkout", checkoutRoute);

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
      ClientModel,
      ProductCatalogModel,
      ProductModel,
      ClientCheckoutModel,
      ProductCheckoutModel,
      OrderModel,
      OrderProductModel,
    ]);
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (migration === undefined || sequelize === undefined) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a order", async () => {
    await request(app)
      .post("/clients")
      .send({
        id: "1",
        name: "Client 1",
        email: "example@test.com",
        document: "123456789",
        address: {
          street: "Street 1",
          number: 123,
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
        },
      });

    await request(app).post("/products").send({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    });

    await request(app).post("/products").send({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      purchasePrice: 200,
      stock: 20,
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [
          {
            productId: "1",
          },
          {
            productId: "2",
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].productId).toBe("1");
    expect(response.body.products[1].productId).toBe("2");
  });
});
