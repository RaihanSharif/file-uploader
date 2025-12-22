import { prisma } from "../prismaClientInstance.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API
);

async function insertFile(file, filePath, fileDetails, folderId, userId) {
    // TODO: some code to upload the actual file to supabase
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
    console.log(fileDetails.originalname);
    return await prisma.file.create({
        data: {
            path: filePath,
            name: fileDetails.originalname, // this is produced by multer when you upload
            folderId: Number(folderId),
            userId: userId,
        },
    });
}

async function deleteFile() {}

async function updateFile() {}

export { insertFile, deleteFile, updateFile };
