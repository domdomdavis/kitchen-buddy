import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.foodItem.createMany({
      data: [
        { product: "bell pepper" },
        { product: "yellow onion" },
        { product: "chili powder" },
        { product: "garlic powder" },
        { product: "ketchup" },
        { product: "BBQ sauce" },
        { product: "bread crumbs" },
        { product: "oat flour" },
        { product: "feta cheese" },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
