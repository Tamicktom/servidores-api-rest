//* Libraries imports
import type { Request, Response } from "express";
import z from "zod";

//* Local imports
import CreateProductService from "../../services/product/CreateProductService";

const productSchema = z.object({
  name: z.string().min(3).max(255),
  price: z.number().min(0),
  description: z.string().min(3).max(255),
  id_category: z.number(),
  banner: z.string().min(3).max(255).optional(),
});

export type ProductRequest = z.infer<typeof productSchema>;

export default class CreateProductController {
  async handle(req: Request, res: Response) {
    const parsedBody = productSchema.parse(req.body);

    if (!req.file) return res.status(400).json({ error: "File is missing" });
    else {
      const { originalname, filename } = req.file;

      parsedBody.banner = filename;

      const createProductService = new CreateProductService().execute(
        parsedBody
      );

      return res.status(201).json(createProductService);
    }
  }
}
