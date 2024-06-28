import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.foodItem.createMany({
      data: [
        { product: "sesame oil" },
        { product: "ume plum vinegar" },
        { product: "scallions" },
        { product: "green onions" },
        { product: "spring onions" },
        { product: "red onions" },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
