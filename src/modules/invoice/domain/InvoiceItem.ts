import type AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

interface InvoiceItemProps {
  id?: Id;
  name: string;
  price: number;
}

export class InvoiceItem implements AggregateRoot {
  private readonly _id: Id;
  private readonly _name: string;
  private readonly _price: number;

  constructor(props: InvoiceItemProps) {
    this._id = props.id ?? new Id();
    this._name = props.name;
    this._price = props.price;
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
