import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.foodItem.createMany({
      data: [
        { product: "blood orange juice" },
        { product: "lemon juice" },
        { product: "lime juice" },
        { product: "orange juice" },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
