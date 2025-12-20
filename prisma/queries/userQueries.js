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

async function addUser({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword,
        },
    });
}

export { getUserByEmail, getUserByUsername, getUserById, addUser };
