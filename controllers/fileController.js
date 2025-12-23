import multer from "multer";
import * as fileDB from "../prisma/queries/fileQueries.js";

// memory storage doesn't have any configs
// file metadata is lost after req->res process is completed
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function getFileUploadForm(req, res) {
    // TODO: later the folder_id should be collected from the req params
    res.render("showFileFormTemp", { title: "upload a file", folder_id: 0 });
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

        await fileDB.insertFile(file.buffer, path, file, folderid, id);

        res.redirect(`/${id}/${folderid}`); // TOOD: fix routing later
    },
];

async function postDeleteFile(req, res, next) {
    const { fileid } = req.params;
    const { id } = req.user;

    const deleteFile = await fileDB.deleteFile(id, fileid);

    res.redirect(`/folder/${deleteFile.folderId}`);
}
export { getFileUploadForm, postFileUpload, postDeleteFile };
