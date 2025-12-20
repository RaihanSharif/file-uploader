import { Router } from "express";

import multer from "multer";
import path from "node:path";
import {
    getFolderForm,
    postNewFolder,
} from "../controllers/folderController.js";
const folderRouter = new Router();

folderRouter.get("/create-folder", getFolderForm);
folderRouter.post("/create-folder", postNewFolder);

export { folderRouter };
