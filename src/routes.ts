//* Libraries imports
import { Router } from "express";

//* Local imports
import CreateUserController from "./controllers/user/CreateUserController";
import DetailUserController from "./controllers/user/DetailUserController";
import AuthUserController from "./controllers/user/AuthUserController";
import isAuthenticated from "./middlewares/isAuthenticated";

const routes = Router();

routes.post("/user", new CreateUserController().handle);
routes.post("/session", new AuthUserController().handle);
routes.get("/userinfo", isAuthenticated, new DetailUserController().handle);

export { routes };
