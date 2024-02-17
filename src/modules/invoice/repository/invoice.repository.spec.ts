import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemModel } from "./invoiceItem.mode";
import { Invoice } from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import { InvoiceItem } from "../domain/InvoiceItem";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "John Doe",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "item 1",
          price: 100,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "item 2",
          price: 200,
        }),
      ],
    });

    const repository = new InvoiceRepository();
    await repository.add(invoice);

    const clientDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [InvoiceItemModel],
    });

    expect(clientDb).toBeDefined();
    expect(clientDb?.id).toEqual(invoice.id.id);
    expect(clientDb?.name).toEqual(invoice.name);
    expect(clientDb?.document).toEqual(invoice.document);
    expect(clientDb?.street).toEqual(invoice.address.street);
    expect(clientDb?.number).toEqual(invoice.address.number);
    expect(clientDb?.complement).toEqual(invoice.address.complement);
    expect(clientDb?.city).toEqual(invoice.address.city);
    expect(clientDb?.state).toEqual(invoice.address.state);
    expect(clientDb?.zipcode).toEqual(invoice.address.zipCode);
    expect(clientDb?.items.length).toEqual(2);
    expect(clientDb?.items[0].id).toEqual(invoice.items[0].id.id);
    expect(clientDb?.items[0].name).toEqual(invoice.items[0].name);
    expect(clientDb?.items[0].price).toEqual(invoice.items[0].price);
    expect(clientDb?.items[1].id).toEqual(invoice.items[1].id.id);
    expect(clientDb?.items[1].name).toEqual(invoice.items[1].name);
    expect(clientDb?.items[1].price).toEqual(invoice.items[1].price);
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

    const repository = new InvoiceRepository();
    const result = await repository.find("1");

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipcode);
    expect(result.items.length).toEqual(2);
    expect(result.items[0].id.id).toEqual(invoice.items[0].id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id.id).toEqual(invoice.items[1].id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  });
});
