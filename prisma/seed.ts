import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();

  try {
    await prisma.inventory.createMany({
      data: [
        {
          item: "strawberries",
        },
        { item: "all-purpose flour" },
        { item: "unsalted butter" },
        { item: "eggs" },
        { item: "bacon" },
        { item: "cinnamon" },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
