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
