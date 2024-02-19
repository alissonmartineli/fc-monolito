import BaseEntity from "../../@shared/domain/entity/base.entity";
import type AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import type Id from "../../@shared/domain/value-object/id.value-object";
import type Address from "../../@shared/domain/value-object/address";

interface ClientProps {
  id?: Id;
  name: string;
  email: string;
  address: Address;
}

export default class Client extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _email: string;
  private readonly _address: Address;

  constructor(props: ClientProps) {
    super(props.id);
    this._name = props.name;
    this._email = props.email;
    this._address = props.address;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get address(): Address {
    return this._address;
  }
}
