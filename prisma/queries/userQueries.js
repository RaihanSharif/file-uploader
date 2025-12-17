import { PrismaClient } from "../generated/prisma/client.js";
import "dotenv/config";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getEmail(email) {}

function getUsername(id) {}

function getUser(id) {}

async function addUser(username, email, password) {
    const hashedPW = await bcrypt.hash(password, 12);
    // insert into User table using prisma
}

export { getEmail, getUsername, getUser, addUser };
