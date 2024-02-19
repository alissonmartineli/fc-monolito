import express, { type Express } from "express";
import request from "supertest";
import { clientRoute } from "../routes/clients.route";
import { type Umzug } from "umzug";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { migrator } from "../../config-migrations/migrator";
import { Sequelize } from "sequelize-typescript";

describe("E2E test for client", () => {
  const app: Express = express();
  app.use(express.json());
  app.use("/clients", clientRoute);

  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ClientModel]);
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

  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
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

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Client 1");
    expect(response.body.email).toBe("example@test.com");
    expect(response.body.document).toBe("123456789");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.city).toBe("City 1");
    expect(response.body.address.state).toBe("State 1");
    expect(response.body.address.zipCode).toBe("12345678");
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });
});
