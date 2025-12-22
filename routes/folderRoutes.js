import { Router } from "express";

import multer from "multer";
import path from "node:path";
import * as folderController from "../controllers/folderController.js";
const folderRouter = new Router();

folderRouter.get("/add-folder", folderController.getFolderForm);
folderRouter.post("/add-folder", folderController.postNewFolder);
folderRouter.get("/:userid/:folderid", folderController.viewFolder);
export { folderRouter };
