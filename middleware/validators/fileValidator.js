import { check, param, validationResult } from "express-validator";

const validateFile = [
    check("file").custom((value, { req }) => {
        // Check file exists
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        const filename = req.file.originalname;

        // Only alphanumeric, dots, dashes, underscores
        if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
            throw new Error(
                "Filename can only include letter, number, dot, dash, underscore"
            );
        }

        // No leading dots
        if (filename.startsWith(".")) {
            throw new Error("Filename cannot start with a dot");
        }

        // No trailing dots
        if (filename.endsWith(".")) {
            throw new Error("Filename cannot end with a dot");
        }

        // Must have an extension
        const lastDot = filename.lastIndexOf(".");
        if (
            lastDot === -1 ||
            lastDot === 0 ||
            lastDot === filename.length - 1
        ) {
            throw new Error("File must have a valid extension");
        }

        // No multiple consecutive dots (optional but recommended)
        if (/\.{2,}/.test(filename)) {
            throw new Error("Filename cannot contain consecutive dots");
        }

        // Length check
        if (filename.length > 255) {
            throw new Error("Filename is too long (maximum 255 characters)");
        }

        return true;
    }),

    param("folderid")
        .isInt({ min: 0 })
        .withMessage("could not find folder to upload to")
        .toInt(),
];

function handleFileValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    next();
}

export { validateFile, handleFileValidationErrors };
