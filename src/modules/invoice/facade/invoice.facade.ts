import type UseCaseInterface from "../../@shared/usecase/use-case.interface";
import type InvoiceFacadeInterface from "./invoice.facade.interface";
import {
  type FindInvoiceFacadeInputDto,
  type FindInvoiceFacadeOutputDto,
  type GenerateInvoiceFacadeInputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private readonly _findUsecase: UseCaseInterface;
  private readonly _addUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }

  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
