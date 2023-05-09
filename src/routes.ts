//* Libraries imports
import { Router } from "express";

//* Local imports
import CreateUserController from "./controllers/user/CreateUserController";
import DetailUserController from "./controllers/user/DetailUserController";
import AuthUserController from "./controllers/user/AuthUserController";
import CreateCategoryController from "./controllers/category/CreateCategoryController";
import isAuthenticated from "./middlewares/isAuthenticated";

const routes = Router();

routes.post("/user", new CreateUserController().handle);
routes.post("/session", new AuthUserController().handle);
routes.get("/userinfo", isAuthenticated, new DetailUserController().handle);

//* --------- Rotas para Category --------- *//
routes.post(
  "/category",
  isAuthenticated,
  new CreateCategoryController().handle
);

export { routes };
