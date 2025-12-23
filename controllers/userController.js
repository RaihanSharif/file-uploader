import { passport } from "../middleware/authMiddleware.js";
import { validationResult, matchedData } from "express-validator";
import * as db from "../prisma/queries/userQueries.js";
import { createFolder } from "../prisma/queries/folderQueries.js";

import { validateUser } from "../middleware/validators/userValidators.js";

function getSignupForm(req, res) {
    if (req.user) {
        res.send("you are already logged in");
    } else {
        res.render("sign-up", {
            title: "sign up to be a member",
        });
    }
}

const postSignupForm = [
    validateUser,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = matchedData(req);
        const user = await db.addUser(data);

        createFolder(user.id, user.username, null);
        res.redirect("/");
    },
];

function logoutUser(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

const loginUser = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-up",
});

export { getSignupForm, postSignupForm, logoutUser, loginUser };
