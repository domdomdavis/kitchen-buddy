import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.recipe.update({
      where: {
        id: "3dd5dc9b-6d82-4a26-8fff-a1fe1c6ba54e",
      },
      data: {
        category: ["Sauces and Spreads", "Keto"],
      },
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
