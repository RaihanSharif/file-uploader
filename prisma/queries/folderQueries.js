import { prisma } from "../prismaClientInstance.js";

/**
 * create root folder when user first signs up
 */
async function createFolder(userId, name, parentId) {
    await prisma.folder.create({
        data: {
            userId: userId,
            name: name,
            parentId: parentId,
        },
    });
}
export { createFolder };
