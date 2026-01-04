import { body, param } from "express-validator";

const validateFolder = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("file name must be between 5 and 20 characters")
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage(
            "Must contain only letters, numbers, underscores and dashes"
        ),
    param("parentid")
        .isInt({ min: 0 })
        .withMessage("parent ID parameter must be a positive integer")
        .toInt(),
];

export { validateFolder };
