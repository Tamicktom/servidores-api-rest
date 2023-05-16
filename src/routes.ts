//* Libraries imports
import { Router } from "express";
import multer from "multer";

//* Config imports
import uploadConfig from "./config/multer";

//* Local imports
import CreateUserController from "./controllers/user/CreateUserController";
import DetailUserController from "./controllers/user/DetailUserController";
import AuthUserController from "./controllers/user/AuthUserController";
import CreateCategoryController from "./controllers/category/CreateCategoryController";
import ListCategoryController from "./controllers/category/ListCategoryController";
import CreateProductController from "./controllers/product/CreateProductController";
import isAuthenticated from "./middlewares/isAuthenticated";

const routes = Router();

const upload = multer(uploadConfig.upload("./tmp"));

//* --------- Rotas para User --------- *//

routes.post("/user", new CreateUserController().handle);
routes.post("/session", new AuthUserController().handle);
routes.get("/userinfo", isAuthenticated, new DetailUserController().handle);

//* --------- Rotas para Category --------- *//
routes.post(
  "/category",
  isAuthenticated,
  new CreateCategoryController().handle
);
routes.get("/category", isAuthenticated, new ListCategoryController().handle);

//* --------- Rotas para Product --------- *//

routes.post("/product", isAuthenticated, upload.single("file"), new CreateProductController().handle);



export { routes };
