//* Libraries imports

//* Local imports
import type { ProductRequest } from "../../controllers/product/CreateProductController";
import p from "../../prisma";

export default class CreateProductService {
  async execute(props: ProductRequest) {
    if (!props.banner || props.banner === "")
      throw new Error("Banner is missing");
    const product = await p.product.create({
      data: {
        name: props.name,
        description: props.description,
        price: props.price,
        categoryId: props.categoryId,
        banner: props.banner,
      },
    });

    return product;
  }
}
