import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { InvoiceItem } from "../../domain/InvoiceItem";
import { Invoice } from "../../domain/invoice";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "John Doe",
  document: "1234-5678",
  address: new Address(
    "Rua 1",
    "123",
    "Complemento",
    "Cidade",
    "Estado",
    "12345-678"
  ),
  items: [
    new InvoiceItem({
      name: "Item 1",
      price: 100,
    }),
    new InvoiceItem({
      name: "Item 2",
      price: 200,
    }),
  ],
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice use case unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual({
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
    });
    expect(result.items).toEqual(
      invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      }))
    );
    expect(result.total).toEqual(invoice.total);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
