import express, { type Express } from "express";
import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { type Umzug } from "umzug";
import { migrator } from "../../config-migrations/migrator";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoiceItem.mode";
import { invoiceRoute } from "../routes/invoice.route";

describe("E2E test for invoice", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/invoice", invoiceRoute);

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
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

  it("should find a invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "John Doe",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipcode: "88888-888",
        createdAt: new Date(),
        items: [
          {
            id: "1",
            name: "item 1",
            price: 100,
          },
          {
            id: "2",
            name: "item 2",
            price: 200,
          },
        ],
      },
      { include: [InvoiceItemModel] }
    );

    const response = await request(app).get("/invoice/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(invoice.id);
    expect(response.body.name).toEqual(invoice.name);
    expect(response.body.document).toEqual(invoice.document);
    expect(response.body.address.street).toEqual(invoice.street);
    expect(response.body.address.number).toEqual(invoice.number);
    expect(response.body.address.complement).toEqual(invoice.complement);
    expect(response.body.address.city).toEqual(invoice.city);
    expect(response.body.address.state).toEqual(invoice.state);
    expect(response.body.address.zipCode).toEqual(invoice.zipcode);
    expect(response.body.items.length).toEqual(2);
    expect(response.body.items[0].id).toEqual(invoice.items[0].id);
    expect(response.body.items[0].name).toEqual(invoice.items[0].name);
    expect(response.body.items[0].price).toEqual(invoice.items[0].price);
    expect(response.body.items[1].id).toEqual(invoice.items[1].id);
    expect(response.body.items[1].name).toEqual(invoice.items[1].name);
    expect(response.body.items[1].price).toEqual(invoice.items[1].price);
  });
});
