import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./db/prismaClient.js";
import express from "express";

import path from "node:path";
import { passport } from "./middleware/authMiddleware.js";
import { userRouter } from "./routes/userRoutes.js";

const assetsPath = path.join(import.meta.dirname, "public");

const mountMiddleware = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: new PrismaSessionStore(prisma, {
                checkedPeriod: 60 * 60 * 1000, // two minute session
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }),
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
        })
    );

    app.use(passport.session());
    app.set("views", path.join(import.meta.dirname, "views"));
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(assetsPath));

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user;
        }
        next();
    });

    app.get("/", (req, res) =>
        res.render("index", { title: "welcome to file uploader" })
    );
    app.use(userRouter);
};

export { mountMiddleware };
