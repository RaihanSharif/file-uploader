import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
const fileRouter = new Router();

fileRouter.get("/add-file/:folderid", fileController.getFileUploadForm);

fileRouter.post("/add-file/:folderid", fileController.postFileUpload);
fileRouter.post("/delete-file/:fileid", fileController.postDeleteFile);
fileRouter.post("/update-file/:fileid", fileController.postRenameFile);

export { fileRouter };
