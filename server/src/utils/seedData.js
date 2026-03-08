import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

export async function seedData() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  try {
    const passwordHash = await bcrypt.hash("test123", 10);
    await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: { passwordHash },
      create: {
        email: "admin@test.com",
        passwordHash,
      },
    });

    const robotsCount = await prisma.robot.count();
    if (robotsCount === 0) {
      await prisma.robot.createMany({
        data: [
          { name: "Robot-1", status: "moving", lat: 52.52, lon: 13.405 },
          { name: "Robot-2", status: "moving", lat: 48.137, lon: 11.575 },
          { name: "Robot-3", status: "moving", lat: 50.11, lon: 8.682 },
        ],
      });
    }

    console.log("Seed complete: admin user + robots ready.");
  } catch (err) {
    console.error("Seed failed during app startup:", err);
  }
}