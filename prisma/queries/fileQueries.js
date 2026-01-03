import { prisma } from "../prismaClientInstance.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API
);

async function getFileById(fileId) {}

async function getFileListById(folderId, userId) {
    // get all the files given a parent folder and a user id
    // TODO: get download links later
    const allFiles = await prisma.file.findMany({
        where: {
            userId: userId,
            folderId: folderId,
        },
    });

    return allFiles;
}

async function getFileByName(fileName) {}

async function insertFile(file, filePath, fileDetails, folderId, userId) {
    const { data, error } = await supabase.storage
        .from("TOPFileUploader")
        .upload(filePath, file, {
            cacheControl: "3600",
            contentType: fileDetails.mimetype,
            upsert: false,
        });

    if (error) {
        console.log("Could not upload file to supabase", error);
    } else {
        console.log("uploaded data:", data);
    }
    return await prisma.file.create({
        data: {
            path: filePath,
            name: fileDetails.originalname, // this is produced by multer when you upload
            folderId: Number(folderId),
            userId: userId,
        },
    });
}

async function deleteFile(userId, fileId) {
    // only deletes file owned by the supplied owner
    const file = await prisma.file.findUnique({
        where: {
            id: Number(fileId),
            userId: userId,
        },
    });

    const { data, error } = await supabase.storage
        .from("TOPFileUploader")
        .remove([file.path]);

    const deletedFile = await prisma.file.delete({
        where: {
            id: Number(fileId),
            userId: userId,
        },
    });

    return deletedFile;
}

async function updateFilename() {}

export { insertFile, deleteFile, updateFilename, getFileListById };
