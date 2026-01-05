import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import path from "node:path";
import { passport } from "./middleware/authMiddleware.js";
import { userRouter } from "./routes/userRoutes.js";

import { PrismaClient } from "./generated/prisma/client.js";
import { indexRouter } from "./routes/indexRoute.js";
import { fileRouter } from "./routes/fileRoutes.js";
import { folderRouter } from "./routes/folderRoutes.js";

const assetsPath = path.join(import.meta.dirname, "public");

const mountMiddleware = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: new PrismaSessionStore(new PrismaClient(), {
                checkedPeriod: 2 * 60 * 1000, // two minute session
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }),
            cookie: {
                secure: process.env.SECURE_COOKIE === "true",
                sameSite: process.env.SAME_SITE,
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            },
        })
    );

    app.use(passport.session());
    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user;
        }
        next();
    });

    app.set("views", path.join(import.meta.dirname, "views/pages"));
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(assetsPath));

    app.use(userRouter);
    app.use(indexRouter);
    app.use(fileRouter);
    app.use(folderRouter);
};

export { mountMiddleware };
