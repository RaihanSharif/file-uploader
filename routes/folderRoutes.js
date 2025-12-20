import { Router } from "express";

import multer from "multer";
import path from "node:path";
import * as folderController from "../controllers/folderController.js";
const folderRouter = new Router();

folderRouter.get("/create-folder", folderController.getFolderForm);
folderRouter.post("/create-folder", folderController.postNewFolder);
export { folderRouter };
