import bcrypt from "bcryptjs";
import { passport } from "../middleware/authMiddleware.js";
import { validationResult, matchedData } from "express-validator";
// import { prisma } from "../db/prismaClient";

import { validateUser } from "../middleware/userValidators.js";

function getSignupForm(req, res) {
    if (req.user) {
        res.send("you are already logged in");
    } else {
        res.render("sign-up", {
            title: "sign up to be a member",
        });
    }
}

export { getSignupForm };
