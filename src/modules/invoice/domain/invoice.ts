import type AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import type Address from "../../@shared/domain/value-object/address";
import type Id from "../../@shared/domain/value-object/id.value-object";
import { type InvoiceItem } from "./InvoiceItem";

interface InvoiceProps {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items?: InvoiceItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Invoice extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _document: string;
  private readonly _address: Address;
  private readonly _items: InvoiceItem[] = [];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    if (props.items !== undefined) {
      this._items = props.items;
    }
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  get total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}
