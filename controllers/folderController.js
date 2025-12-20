import * as db from "../prisma/queries/folderQueries.js";

function getFolderForm(req, res) {
    if (req.user) {
        res.render("tempFolderCreate.ejs", { title: "create a new folder" });
    }
}

function postNewFolder(req, res, next) {
    try {
        db.createFolder(req.user.id, req.body.name, +req.body.parentId);
        res.redirect("/");
    } catch (err) {
        next(err);
    }
}

export { getFolderForm, postNewFolder };
