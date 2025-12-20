import { prisma } from "../prismaClientInstance.js";
import { Prisma } from "../../generated/prisma/client.js";
/**
 * create root folder when user first signs up
 */
async function createFolder(userId, name, parentId) {
    try {
        return await prisma.folder.create({
            data: {
                userId: userId,
                name: name,
                parentId: parentId,
            },
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                console.log("there was an error");
            }
        }
        throw err;
    }
}

async function deleteFolder(folderId, userId) {
    // delete only if folder has a parentId
    // and the right user Id is supplied
}

async function renameFolder(folderId, userId) {}

export { createFolder };
