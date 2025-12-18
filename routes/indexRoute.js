import { Router } from "express";
import { renderHome } from "../controllers/indexController.js";

const indexRouter = new Router();

indexRouter.get("/", renderHome);

export { indexRouter };
