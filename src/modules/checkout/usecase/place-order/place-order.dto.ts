export interface PlaceOrderInputDto {
  clientId: string;
  products: Array<{
    productId: string;
  }>;
}

export interface PlaceOrderOutputDto {
  id: string;
  total: number;
  products: Array<{
    productId: string;
  }>;
}
