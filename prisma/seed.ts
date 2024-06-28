import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.foodItem.createMany({
      data: [
        { product: "gorgonzola cheese" },
        { product: "raspberries" },
        { product: "basil" },
        { product: "quinoa" },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
