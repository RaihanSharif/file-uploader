import { prisma } from "../prismaClientInstance.js";

/**
 * create root folder when user first signs up
 */
async function createFolder(userId, name, parentId) {
    return await prisma.folder.create({
        data: {
            userId: userId,
            name: name,
            parentId: parentId,
        },
    });
}

async function deleteFolder(folderId, userId) {
    // delete only if folder has a parentId
    // and the right user Id is supplied
}

async function renameFolder(folderId, userId) {}

export { createFolder };
