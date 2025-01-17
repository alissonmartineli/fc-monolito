/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from "express";
import ProductRepository from "../../modules/product-adm/repository/product.repository";
import AddProductUseCase from "../../modules/product-adm/usecase/add-product/add-product.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  try {
    const usecase = new AddProductUseCase(new ProductRepository());

    const productDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    const output = await usecase.execute(productDto);

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
