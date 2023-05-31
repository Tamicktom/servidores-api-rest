//* Libraries imports
import axios from "axios";
import z from "zod";

const ImageUrl =
  "https://i.pinimg.com/564x/9b/14/51/9b1451178712523a1e87db4c06cc0deb.jpg";

const randomUser = {
  name: generateRandomName(),
  email: generateRandomEmail(),
  password: "123zxcZXC@",
};

async function downloadImageToFormData(url: string): Promise<FormData> {
  const response = await axios.get(url, {
    responseType: "arraybuffer", // Indica que a resposta deve ser tratada como um array de bytes
  });

  const formData = new FormData();
  const blob = new Blob([response.data], { type: "image/jpeg" });
  formData.append("file", blob, "imagem.jpg");

  return formData;
}

function generateRandomName() {
  let randomName = "";
  for (let i = 0; i < 10; i++) {
    randomName += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return randomName;
}

function generateRandomDescription(size: number) {
  let randomDescription = "";
  for (let i = 0; i < size; i++) {
    randomDescription += String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
    );
  }
  //put some spaces
  randomDescription = randomDescription.replace(/(.{10})/g, "$1 ");
  //put a dot at the end
  randomDescription += ".";
  return randomDescription;
}

function generateRandomPrice(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEmail() {
  let beforeAt = "";
  for (let i = 0; i < 10; i++) {
    beforeAt += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return `${beforeAt}@gmail.com`;
}

//* local variables
const user: User = {
  id: "",
  name: "",
  email: "",
};

let token: string = "";

console.log("Test all EndPoints!");

console.log("It should be possible to create an account");

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email("Invalid email address"),
});

type User = z.infer<typeof userSchema>;

async function createUser() {
  const body = {
    name: randomUser.name,
    email: randomUser.email,
    password: randomUser.password,
  };
  await axios
    .post("http://localhost:3333/user", body)
    .then((response) => {
      console.log(response.data);
      const tmpUser = userSchema.parse(response.data);
      user.id = tmpUser.id;
      user.name = tmpUser.name;
      user.email = tmpUser.email;
      console.log("User created!");
    })
    .catch((error) => {
      console.error("Error creating user");
      console.log(error);
    });
}

console.log("It should be possible to get session token");

const sessionSchema = z.object({
  token: z.string(),
  user: userSchema,
});

async function getSessionToken() {
  const body = {
    email: user.email,
    password: randomUser.password,
    name: user.name,
  };
  await axios
    .post("http://localhost:3333/session", body)
    .then((response) => {
      console.log(response.data);
      const tmpSession = sessionSchema.parse(response.data);
      token = tmpSession.token;
      console.log("Session token created!");
    })
    .catch((error) => {
      console.error("Error creating session token");
      console.log(error);
    });
}

console.log("It should be possible to get user info");

const userInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email("Invalid email address"),
});

async function getUserInfo() {
  await axios
    .get("http://localhost:3333/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      const tmpUserInfo = userInfoSchema.parse(response.data);
      console.log("User info retrieved!");
    })
    .catch((error) => {
      console.error("Error retrieving user info");
      console.log(error);
    });
}

console.log("It should be possible to add a category");

const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

async function addCategory() {
  const body = {
    name: generateRandomName(),
  };
  await axios
    .post("http://localhost:3333/category", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      const tmpCategory = categorySchema.parse(response.data);
      console.log("Category added!");
    })
    .catch((error) => {
      console.error("Error adding category");
      console.log(error);
    });
}

console.log("It should be possible to get all categories");

const categoriesSchema = z.array(categorySchema);

type Categories = z.infer<typeof categoriesSchema>;

async function getAllCategories() {
  const res: Categories = [];
  await axios
    .get("http://localhost:3333/category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      const tmpCategories = categoriesSchema.parse(response.data);
      console.log("Categories retrieved!");
      res.push(...tmpCategories);
    })
    .catch((error) => {
      console.error("Error retrieving categories");
      console.log(error);
    });
  return res;
}

console.log("It should be possible to add a product");

const fullCategorySchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

type FullCategory = z.infer<typeof fullCategorySchema>;

const productSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  image: z.string().nullable(),
  name: z.string(),
  price: z.number(),
  banner: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  categoryId: z.string().uuid(),
  category: fullCategorySchema.optional(),
});

type Product = z.infer<typeof productSchema>;

const addProductSchema = z.object({});

async function addProduct() {
  const form = await downloadImageToFormData(ImageUrl);
  form.append("name", generateRandomName());
  form.append("price", `${generateRandomPrice(1, 100)}`);
  form.append("description", generateRandomDescription(50));
  const categories = await getAllCategories();
  form.append("categoryId", categories[0].id);
  await axios
    .post("http://localhost:3333/product", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
        "Content-Type": `multipart/form-data`,
      },
    })
    .then((response) => {
      console.log("Add product response:", response.data);
      const tmpProduct = addProductSchema.parse(response.data);
      console.log("Product added!");
    })
    .catch((error) => {
      console.error("Error adding product");
      console.log(error);
    });
}

console.log(
  "It should be possible to get all products from a especific category"
);

const productsSchema = z.array(
  z.object({
    id: z.string().uuid(),
    description: z.string(),
    image: z.string().nullable(),
    name: z.string(),
    price: z.number(),
    banner: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    categoryId: z.string().uuid(),
    category: z.object({
      id: z.string().uuid(),
      description: z.string().nullable(),
      name: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      deletedAt: z.string().nullable(),
    }),
  })
);

type Products = z.infer<typeof productsSchema>;

async function listByCategory(categoryId: string) {
  const res: Products = [];
  console.log("Getting all products by category:" + categoryId);
  // add category_id to query params
  console.log(
    `http://localhost:3333/category/product?id_category=${categoryId}`
  );
  await axios
    .get(`http://localhost:3333/category/product?id_category=${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      const tmpProducts = productsSchema.parse(response.data);
      console.log("Products retrieved!");
      res.push(...tmpProducts);
    })
    .catch((error) => {
      console.error("Error retrieving products");
      console.log(error);
    });
  return res;
}

console.log("It should be possible to create an order");

const orderSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  table: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  status: z.string(),
  draft: z.boolean(),
});

type Order = z.infer<typeof orderSchema>;

async function createOrder() {
  const ret: Order = {
    id: "",
    name: "",
    table: 0,
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
    status: "",
    draft: false,
  };
  const body = {
    name: generateRandomName(),
    table: generateRandomPrice(1, 10),
  };
  await axios
    .post("http://localhost:3333/order", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      const tmpOrder = orderSchema.parse(response.data);
      console.log("Order created!");
      ret.id = tmpOrder.id;
      ret.name = tmpOrder.name;
      ret.table = tmpOrder.table;
      ret.createdAt = tmpOrder.createdAt;
      ret.updatedAt = tmpOrder.updatedAt;
      ret.deletedAt = tmpOrder.deletedAt;
      ret.status = tmpOrder.status;
      ret.draft = tmpOrder.draft;
    })
    .catch((error) => {
      console.error("Error creating order");
      console.log(error);
    });
  return ret;
}

console.log("It should be possible to add a product to an order");

const orderProductSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
});

type OrderProduct = z.infer<typeof orderProductSchema>;

async function addProductToOrder(order: Order) {
  const categories = await getAllCategories();
  if (!categories.length) throw new Error("No categories found");
  const products = await listByCategory(categories[0].id);
  if (!products.length) throw new Error("No products found");
  console.warn("Produtos:", products);
  const body = {
    quantity: generateRandomPrice(1, 10),
    orderId: order.id,
    productId: products[0].id,
  };
  const res: OrderProduct = {
    id: "",
    quantity: 0,
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
    orderId: "",
    productId: "",
  };
  await axios
    .post("http://localhost:3333/order/additem", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      const tmpOrderProduct = orderProductSchema.parse(response.data);
      res.id = tmpOrderProduct.id;
      res.quantity = tmpOrderProduct.quantity;
      res.createdAt = tmpOrderProduct.createdAt;
      res.updatedAt = tmpOrderProduct.updatedAt;
      res.deletedAt = tmpOrderProduct.deletedAt;
      res.orderId = tmpOrderProduct.orderId;
      res.productId = tmpOrderProduct.productId;
      console.log("Product added to order!");
    })
    .catch((error) => {
      console.error("Error adding product to order");
      console.log(error);
    });
  return res;
}

async function removeProductFromOrder(order: string, itemId: string) {
  // const query = `?orderId=${order.id}&itemId=${itemId}`;
  const body = {
    orderId: order,
    itemId,
  };
  console.log("Removing product from order. Data:", body);
  await axios
    .post(`http://localhost:3333/order/item`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.message !== "Item removed successfully")
        console.error("Error removing product from order", response.data);
      console.log("Product removed from order!");
    })
    .catch((error) => {
      console.error("Error removing product from order");
      console.log(error);
    });
}

createUser().then(() => {
  setTimeout(() => {
    getSessionToken().then(() => {
      setTimeout(() => {
        getUserInfo();
        getAllCategories();
        addCategory()
          .then(() => addProduct())
          .then(() => {
            createOrder().then((order) => {
              addProductToOrder(order).then((item) => {
                setTimeout(() => {
                  removeProductFromOrder(item.orderId, item.id);
                }, 500);
              });
            });
          });
      }, 500);
    });
  }, 500);
});
