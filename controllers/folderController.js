import * as folderDB from "../prisma/queries/folderQueries.js";
import * as fileDB from "../prisma/queries/fileQueries.js";

function getFolderForm(req, res) {
    if (req.user) {
        res.render("tempFolderCreate.ejs", { title: "create a new folder" });
    } else {
        res.status(403).send("must be logged in");
    }
}

async function postNewFolder(req, res, next) {
    try {
        await folderDB.createFolder(
            req.user.id,
            req.body.name,
            +req.body.parentId
        );
        res.redirect("/");
    } catch (err) {
        console.log("there was an error: ", err.code);
        res.redirect("/sign-up");
    }
}

async function buildBreadcrumbs(folder, userId) {
    const breadcrumbs = [];

    let current = folder;
    while (current) {
        breadcrumbs.unshift(current);
        if (!current.parentId) {
            break;
        }
        current = await folderDB.getFolder(current.parentId, userId);
    }

    return breadcrumbs;
}

async function viewFolder(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send("log in to view folders");
    }

    const { folderid } = req.params;
    const { id } = req.user;

    const folder = await folderDB.getFolder(folderid, id);

    if (!folder) {
        return res.send(`you're trying to access someone else's folder`);
    }

    const breadcrumbs = await buildBreadcrumbs(folder, id);

    res.render("index", {
        folder: folder,
        title: "index",
        breadcrumbs: breadcrumbs,
    });
}

async function viewUserRootFolder(req, res, next) {}

export { getFolderForm, postNewFolder, viewFolder };
