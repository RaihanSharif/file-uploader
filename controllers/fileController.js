import multer from "multer";
import * as fileDB from "../prisma/queries/fileQueries.js";
import * as folderDB from "../prisma/queries/folderQueries.js";
import { Prisma } from "../generated/prisma/index.js";

// memory storage doesn't have any configs
// file metadata is lost after req->res process is completed
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    // file upload validator
    upload.single("content"),
    async (req, res, next) => {
        const { folderid } = req.params;
        const { username, id } = req.user;
        const file = req.file;

        // TODO: validattion error check

        const path = `${username}/${folderid}/${file.originalname}`;
        try {
            await fileDB.insertFile(file.buffer, path, file, folderid, id);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    return res.send(
                        `${file.originalname} already exists in this folder`
                    );
                }
            }
            return next(err);
        }

        res.redirect(`/${id}/${folderid}`); // TODO: fix routing later
    },
];

async function postDeleteFile(req, res, next) {
    const { fileid } = req.params;
    const { id } = req.user;

    const deletedFile = await fileDB.deleteFile(id, fileid);

    res.redirect(`/${id}/${deletedFile.folderId}`);
}
export { getFileUploadForm, postFileUpload, postDeleteFile };
