import { body } from "express-validator";

const validateUser = [
    body("username")
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isAlphanumeric()
        .withMessage(`Username must only contain letters and numbers`)
        .isLength({ min: 1, max: 255 }),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage(`Please use correct email formatting`)
        // .custom(async (value) => {
        //     const { rows } = await query(
        //         "SELECT * FROM account WHERE email = $1",
        //         [value]
        //     );
        //     if (rows.length >= 1) {
        //         throw new Error("E-mail already in use");
        //     }
        // })
        .normalizeEmail(),
    body("password")
        .trim()
        .isStrongPassword()
        .withMessage(
            "password must be at least 8 characters long, contain 1 lowercase letter, one uppercase letter, and 1 symbol"
        ),
    body("confirm-password")
        .trim()
        .isStrongPassword()
        .withMessage(
            "password must be at least 8 characters long, contain 1 lowercase letter, one uppercase letter, and 1 symbol"
        )
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                throw new Error("passwords do not match");
            } else {
                return value;
            }
        }),
];

export { validateUser };
