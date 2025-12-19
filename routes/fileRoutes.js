import { Router } from "express";
// import { uploadFileController } from "../controllers/fileController.js";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/files/");
    },

    filename: function (req, file, cb) {
        // Create unique filename: fieldname-timestamp-randomnumber.jpg
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

const fileRouter = new Router();

fileRouter.get("/create-file", (req, res) => {
    res.render("showFileFormTemp", { title: "upload a file", folder_id: 0 });
});

fileRouter.post("/create-file", upload.single("content"), (req, res, next) => {
    console.log(req.file, req.body);
    res.send("File uploaded!");
});

export { fileRouter };
