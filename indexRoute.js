import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./db/prismaClient.js";

import path from "node:path";

const assetsPath = path.join(import.meta.dirname, "public");

const mountMiddleware = (app) => {
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: new PrismaSessionStore(prisma, {
                checkedPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }),
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
        })
    );

    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(assetsPath));
};

export { mountMiddleware };
