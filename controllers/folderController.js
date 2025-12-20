import * as db from "../prisma/queries/folderQueries.js";
import { Prisma } from "../generated/prisma/client.js";

function getFolderForm(req, res) {
    if (req.user) {
        res.render("tempFolderCreate.ejs", { title: "create a new folder" });
    } else {
        res.status(403).send("must be logged in");
    }
}

function postNewFolder(req, res, next) {
    try {
        const insert = db.createFolder(
            req.user.id,
            req.body.name,
            +req.body.parentId
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(409).send(err);
    }
}

export { getFolderForm, postNewFolder };
