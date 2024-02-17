import { type Invoice } from "../domain/invoice";

export default interface InvoiceGateway {
  add: (client: Invoice) => Promise<void>;
  find: (id: string) => Promise<Invoice>;
}
