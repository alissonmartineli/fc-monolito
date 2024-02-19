/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from "express";
import FindInvoiceUseCase from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const usecase = new FindInvoiceUseCase(new InvoiceRepository());

    const invoiceDto = {
      id: req.params.id,
    };

    const output = await usecase.execute(invoiceDto);

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
