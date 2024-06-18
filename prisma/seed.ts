import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.category.createMany({
      data: [
        { name: "breakfast" },
        { name: "breads" },
        { name: "healthy" },
        { name: "dessert" },
        { name: "entrees" },
        { name: "winter" },
        { name: "summer" },
        { name: "spring" },
        { name: "autumn" },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
