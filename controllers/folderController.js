import * as folderDB from "../prisma/queries/folderQueries.js";
import * as fileDB from "../prisma/queries/fileQueries.js";
import { validateFolder } from "../middleware/validators/folderValidator.js";
import { validationResult, matchedData } from "express-validator";
import { Prisma } from "../generated/prisma/index.js";

function getFolderForm(req, res) {
    if (req.user) {
        res.render("tempFolderCreate.ejs", {
            title: "create a new folder",
            parentid: req.params.parentid,
        });
    } else {
        res.status(403).send("must be logged in");
    }
}

const postNewFolder = [
    validateFolder,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, parentid } = matchedData(req);

        const parentFolder = await folderDB.getFolder(parentid, req.user.id);

        if (!parentFolder) {
            return res.send(
                "you are trying to upload to a folder that does not exist"
            );
        }

        try {
            const folder = await folderDB.createFolder(
                req.user.id,
                name,
                parentid
            );
            res.redirect(`/${req.user.id}/${folder.id}`);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === "P2002") {
                    return res.send(`${name} already exists in this folder`);
                }
            }
            return next(err);
        }
    },
];

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
        console.log("log in to view folders");
        return res.redirect("/");
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

async function postDeleteFolder(req, res, next) {
    const folderid = Number(req.params["folderid"]);
    const userid = req.user.id;

    // const folder = await folderDB.getFolder(folderid, userid);
    // if (!folder) {
    //     return res.send("could not find folder to delete");
    // }

    // if (!folder.parentId) {
    //     return res.status(400).send("cannot delete root folder");
    // }

    const deletedFolder = await folderDB.deleteFolder(folderid, userid);
    if (deletedFolder) {
        console.log(deletedFolder);
        return res.redirect(`/${userid}/${deletedFolder.parentId}`);
    } else {
        return res.status(400).send("folder does not exist");
    }
}

const postRenameFolder = [
    validateFolder,
    async (req, res, next) => {
        // get a file id, and user id from the request
        // if the user id matches the req.user.id rename
        if (!req.isAuthenticated()) {
            res.send("must be logged in to update folder");
        }
        const { folderid } = req.params;
        console.log("renaming folder");
        const changedFolder = await folderDB.renameFolder(
            +folderid,
            req.user.id,
            req.body.name
        );
        if (changedFolder) {
            return res.redirect(`/${req.user.id}/${folderid}`);
        } else {
            return res.send("could not rename folder");
        }
    },
];

export {
    getFolderForm,
    postNewFolder,
    viewFolder,
    postDeleteFolder,
    postRenameFolder,
};
