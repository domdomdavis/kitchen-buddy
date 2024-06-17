import { PrismaClient } from "@prisma/client";

async function seed() {
  const prisma = new PrismaClient();
  const dom = await prisma.user.create({
    data: {
      username: "dom",
      passwordHash:
        "$2a$04$/7rpgzZqWUjG07StH1m.Ye0WIyrWzUIzWwpK1io2jGUljQ1lOwfgu",
    },
  });
  try {
    await prisma.recipe.create({
      data: {
        user_id: dom.id,
        title: "chocolate chip cookies",
        instructions: [
          "mix dry stuff",
          "put wet stuff in dry stuff",
          "mix in chocolate chips",
          "bake at 350 degrees F for 11 minutes",
        ],
        photo_url:
          "https://www.modernhoney.com/wp-content/uploads/2019/01/The-Best-Chocolate-Chip-Cookies-2.jpg",
        ingredients: {
          createMany: {
            data: [
              { amount: "1 teaspoon", ingredient: "salt" },
              { amount: "1 cup", ingredient: "chocolate chips" },
              { amount: "1", ingredient: "egg" },
            ],
          },
        },
      },
      include: {
        ingredients: true,
      },
    });

    await prisma.inventory.createMany({
      data: [
        { item: "bacon", user_id: dom.id },
        { item: "egg", user_id: dom.id },
        { item: "potato", user_id: dom.id },
      ],
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
