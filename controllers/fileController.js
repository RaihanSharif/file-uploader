import multer from "multer";
import * as fileDB from "../prisma/queries/fileQueries.js";
import * as folderDB from "../prisma/queries/folderQueries.js";
import { Prisma } from "../generated/prisma/index.js";
import {
    handleFileValidationErrors,
    validateFile,
} from "../middleware/validators/fileValidator.js";

// memory storage doesn't have any configs
// file metadata is lost after req->res process is completed
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 1,
    },
});

async function getFileUploadForm(req, res) {
    const folder = folderDB.getFolder(+req.params.folderid, req.user.id);
    if (!folder) {
        res.send("could not find folder to upload file");
    }
    res.render("showFileFormTemp", {
        title: "upload a file",
        folderid: req.params.folderid,
    });
}

const postFileUpload = [
    (req, res, next) => {
        upload.single("content")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res
                        .status(400)
                        .send("File too large (max size: 50MB)");
                }

                if (err.code === "LIMIT_FILE_COUNT") {
                    return res
                        .status(400)
                        .send("can only upload 1 file at a time");
                }
            }
            next();
        });
    },
    validateFile,
    handleFileValidationErrors,
    async (req, res, next) => {
        const { folderid } = req.params;
        const { username, id } = req.user;
        const file = req.file;

        const path = `${username}/${folderid}/${file.originalname}`;
        try {
            await fileDB.insertFile(file.buffer, path, file, folderid, id);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code == "P2003") {
                    return res
                        .status(400)
                        .send("could not find the folder to upload to");
                }
                if (err.code === "P2002") {
                    return res.send(
                        `${file.originalname} already exists in this folder`
                    );
                }
            }
            return next(err);
        }

        res.redirect(`/${id}/${folderid}`);
    },
];

async function postDeleteFile(req, res, next) {
    const { fileid } = req.params;
    const { id } = req.user;

    const deletedFile = await fileDB.deleteFile(id, fileid);

    res.redirect(`/${id}/${deletedFile.folderId}`);
}

async function postRenameFile(req, res, next) {
    const { fileid } = req.params;
    const { name } = req.body;
    console.log(req.user.id);
    console.log(+fileid);
    const renamedFile = await fileDB.updateFilename(+fileid, req.user.id, name);
    if (renamedFile) {
        res.redirect(`/${req.user.id}/${renamedFile.folderId}`);
    } else {
        res.send("could not rename file");
    }
}
export { getFileUploadForm, postFileUpload, postDeleteFile, postRenameFile };
