import * as db from "../prisma/queries/folderQueries.js";
import { Prisma } from "../generated/prisma/client.js";

function getFolderForm(req, res) {
    if (req.user) {
        res.render("tempFolderCreate.ejs", { title: "create a new folder" });
    } else {
        res.status(403).send("must be logged in");
    }
}

async function postNewFolder(req, res, next) {
    try {
        await db.createFolder(req.user.id, req.body.name, +req.body.parentId);
        res.redirect("/");
    } catch (err) {
        console.log("there was an error: ", err.code);
        res.redirect("/sign-up");
    }
}

export { getFolderForm, postNewFolder };
