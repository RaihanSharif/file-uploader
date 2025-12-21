import multer from "multer";
import path from "node:path";
import { prisma } from "../prismaClientInstance.js";

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
        console.log(`file xtension: ${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

function getFileUploadForm(req, res) {
    // TODO: later the folder_id should be collected from the req params
    res.render("showFileFormTemp", { title: "upload a file", folder_id: 0 });
}

async function createFile(file, filePath, fileDetails, folderId, userId) {
    // TODO: some code to upload the actual file to supabase
    return await prisma.file.create({
        data: {
            path: filePath,
            name: fileDetails.originalName, // this is produced by multer when you upload
            folderId: folderId,
            userId: userId,
        },
    });
}

fileRouter.post("/create-file", upload.single("content"), (req, res, next) => {
    if (!req.file) {
        res.send("no file uploaded!");
    }
    console.log(req.file, req.body);
    res.send("File uploaded!");
});

export { fileRouter };
