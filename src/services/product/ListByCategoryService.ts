//* Libraries imports
import z from "zod";
//* Local imports
import p from "../../prisma";
import type { ProductCategory } from "../../controllers/product/ListByCategoryController";

export default class ListByCategoryService {
  async execute({ id_category }: ProductCategory) {
    const products = await p.product.findMany({
      where: { id: id_category },
      include: { category: true },
    });

    return products;
  }
}
