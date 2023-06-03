//* Libraries imports
import type { Order } from "@prisma/client";

//* Local imports
import p from "../../prisma";
import type { ListOrderRequest } from "../../controllers/order/ListOrderController";

export default class ListOrderService {
  async execute(req: ListOrderRequest) {
    const page = req.page || 1;
    const limit = req.limit || 10;
    const search = req.search || "";
    const listBy = req.listBy || "name";

    let orders: Order[] = [];
    if (listBy === "name") {
      orders = await p.order.findMany({
        where: {
          name: {
            contains: search,
          },
        },
        orderBy: {
          name: "asc",
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      });
    } else if (listBy === "date") {
      orders = await p.order.findMany({
        where: {
          name: {
            contains: search,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    // get all orders in the last hour
    else {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      orders = await p.order.findMany({
        where: {
          name: {
            contains: search,
          },
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return orders;
  }
}
