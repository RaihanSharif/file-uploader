import * as fileDB from "../prisma/queries/folderQueries.js";

async function renderHome(req, res) {
    if (req.isAuthenticated()) {
        const folder = await fileDB.getRootFolder(req.user.id);
        return res.redirect(`/${req.user.id}/${folder.id}`);
    }
    res.render("pages/index", { title: "welcome to file uploader" });
}

export { renderHome };
