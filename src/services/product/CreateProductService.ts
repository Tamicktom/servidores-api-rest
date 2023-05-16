//* Libraries imports

//* Local imports
import type { ProductRequest } from "../../controllers/product/CreateProductController";
import p from "../../prisma";

export default class CreateProductService {
  async execute(props: ProductRequest) {
    const product = await p.product.create({
      data: props,
    });

    return product;
  }
}
