import { Router } from "express";

import multer from "multer";
import path from "node:path";
import * as folderController from "../controllers/folderController.js";
const folderRouter = new Router();

folderRouter.get("/add-folder/:parentid", folderController.getFolderForm);
folderRouter.post("/add-folder/:parentid", folderController.postNewFolder);
folderRouter.get("/:userid/:folderid", folderController.viewFolder);
export { folderRouter };
