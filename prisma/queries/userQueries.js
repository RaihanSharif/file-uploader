import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../prismaClientInstance.js";

async function getUserByEmail(email) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    return user;
}

async function getUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    console.log(`getUserByUsername: `);
    console.log(user);
    return user;
}

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    return user;
}

async function addUser(username, email, password) {
    const hashedPW = await bcrypt.hash(password, 12);
    try {
        prisma.user.create({
            data: {
                username: username,
                email,
                password: hashedPW,
            },
        });
    } catch (err) {
        console.err(err);
    }
}

export { getUserByEmail, getUserByUsername, getUserById, addUser };
