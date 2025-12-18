import { body } from "express-validator";
import * as db from "../prisma/queries/userQueries.js";

const validateUser = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("username must be between 3 and 20 characters")
        .custom(async (val) => {
            const user = await db.getUserByUsername(val);
            if (user) {
                throw new Error("username already exists");
            } else {
                return true;
            }
        }),
    body("email")
        .isEmail()
        .withMessage(`A correctly formatted email address required`)
        .normalizeEmail()
        .custom(async (val) => {
            const user = await db.getUserByEmail(val);
            if (user) {
                throw new Error("email already exists");
            } else {
                return true;
            }
        }),
    body("password")
        .isStrongPassword()
        .withMessage(
            "password must be at least 8 characters long, contain 1 lowercase letter, one uppercase letter, and 1 symbol"
        ),
    body("confirm-password")
        .isStrongPassword()
        .withMessage(
            "password must be at least 8 characters long, contain 1 lowercase letter, one uppercase letter, and 1 symbol"
        )
        .custom((val, { req }) => {
            return val === req.body.password;
        }),
];

export { validateUser };
