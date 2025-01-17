export interface GenerateInvoiceFacadeInputDto {
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface FindInvoiceFacadeInputDto {
  id: string;
}

export interface FindInvoiceFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  total: number;
  createdAt: Date;
}

export default interface InvoiceFacadeInterface {
  generate: (input: GenerateInvoiceFacadeInputDto) => Promise<void>;
  find: (
    input: FindInvoiceFacadeInputDto
  ) => Promise<FindInvoiceFacadeOutputDto>;
}
