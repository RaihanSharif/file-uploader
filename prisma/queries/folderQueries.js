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
    const folder = await prisma.folder.delete({
        where: {
            id: folderId,
            userId: userId,
        },
    });

    return folder;
}

async function getRootFolder(userId) {
    return await prisma.folder.findFirst({
        where: {
            userId: userId,
            parentFolder: null,
        },
        include: {
            files: true,
            children: true,
        },
    });
}

async function renameFolder(folderId, userId) {}

/**
 *
 * @param {int} folderId the folder to fetch
 * @param {int} userId the user which the folder belongs to
 * @returns the folder and its files and subfolders
 */
async function getFolder(folderId, userId) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: Number(folderId),
            userId: userId,
        },
        include: {
            children: true,
            files: true,
        },
    });

    return folder;
}

async function getFolderList(folderId, userId) {}

async function updateFolderName(folderId) {}

export { createFolder, getFolder, getRootFolder, deleteFolder };
