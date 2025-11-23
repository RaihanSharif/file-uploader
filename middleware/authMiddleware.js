import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

import prisma from "../db/prismaClient";

const localStrat = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return done(null, false, { message: "Incorrect email." });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

passport.use(localStrat);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        console.log(user); // TODO: what does prisma return?

        done(null, user);
    } catch (err) {
        return done(err);
    }
});

export default passport;
