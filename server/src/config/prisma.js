import { PrismaPg } from "@prisma/adapter-pg";
import prismaPkg from "@prisma/client";

const { PrismaClient } = prismaPkg;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
