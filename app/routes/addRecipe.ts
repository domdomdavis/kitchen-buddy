import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};

export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const newRecipe = await prisma.recipe.create({
    data: {
      title: formData.title,
      photo_url: formData.photo_url,
      ingredients: {
        create: formData.ingredients,
      },
      instructions: formData.instructions,
    },
    include: {
      ingredients: true,
    },
  });
  return newRecipe;
};
