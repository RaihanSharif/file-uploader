import { PrismaClient } from "../generated/prisma/client.js";
import "dotenv/config";

const prisma = new PrismaClient();

export { prisma };
