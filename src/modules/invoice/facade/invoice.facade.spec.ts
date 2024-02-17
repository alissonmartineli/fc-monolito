import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import { InvoiceModel } from "../repository/invoice.model";
import { InvoiceItemModel } from "../repository/invoiceItem.mode";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";

describe("Invoice Facade test", () => {
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

  it("should generate a invoice", async () => {
    const repository = new InvoiceRepository();
    const addUsecase = new GenerateInvoiceUseCase(repository);
    const findUsecase = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      addUsecase,
      findUsecase,
    });

    const input = {
      name: "John Doe",
      document: "123456789",
      street: "Rua A",
      number: "123",
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      include: [InvoiceItemModel],
    });

    expect(invoice).toBeDefined();
    expect(invoice?.id).toBeDefined();
    expect(invoice?.name).toEqual(input.name);
    expect(invoice?.document).toEqual(input.document);
    expect(invoice?.street).toEqual(input.street);
    expect(invoice?.number).toEqual(input.number);
    expect(invoice?.complement).toEqual(input.complement);
    expect(invoice?.city).toEqual(input.city);
    expect(invoice?.state).toEqual(input.state);
    expect(invoice?.zipcode).toEqual(input.zipCode);
    expect(invoice?.items.length).toEqual(2);
    expect(invoice?.items[0].id).toEqual(input.items[0].id);
    expect(invoice?.items[0].name).toEqual(input.items[0].name);
    expect(invoice?.items[0].price).toEqual(input.items[0].price);
    expect(invoice?.items[1].id).toEqual(input.items[1].id);
    expect(invoice?.items[1].name).toEqual(input.items[1].name);
    expect(invoice?.items[1].price).toEqual(input.items[1].price);
  });

  it("should find a invoice", async () => {
    const repository = new InvoiceRepository();
    const addUsecase = new GenerateInvoiceUseCase(repository);
    const findUsecase = new FindInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      addUsecase,
      findUsecase,
    });

    const input = {
      id: "1",
      name: "John Doe",
      document: "123456789",
      street: "Rua A",
      number: "123",
      complement: "Casa",
      city: "São Paulo",
      state: "SP",
      zipcode: "12345678",
      createdAt: new Date(),
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    await InvoiceModel.create(input, {
      include: [InvoiceItemModel],
    });

    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.street);
    expect(invoice.address.number).toBe(input.number);
    expect(invoice.address.complement).toBe(input.complement);
    expect(invoice.address.city).toBe(input.city);
    expect(invoice.address.state).toBe(input.state);
    expect(invoice.address.zipCode).toBe(input.zipcode);
    expect(invoice.items.length).toBe(2);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
  });
});
