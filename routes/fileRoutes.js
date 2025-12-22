import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
const fileRouter = new Router();

fileRouter.get("/add-file", (req, res) => {
    res.render("showFileFormTemp", { title: "upload a file", folderid: 1 });
});

fileRouter.post("/add-file/:folderid", fileController.postFileUpload);

export { fileRouter };
