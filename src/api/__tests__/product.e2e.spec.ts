import express, { type Express } from "express";
import request from "supertest";
import { productRoute } from "../routes/products.route";
import { Sequelize } from "sequelize-typescript";
import { type Umzug } from "umzug";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { migrator } from "../../config-migrations/migrator";

describe("E2E test for product", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/products", productRoute);

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ProductModel]);
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

  it("should create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Description 1");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });
});
