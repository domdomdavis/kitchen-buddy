import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};

export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const deleteIngredients = prisma.ingredientList.deleteMany({
    where: {
      recipe_id: formData.id,
    },
  });
  const deleteRecipe = prisma.recipe.delete({
    where: {
      id: formData.id,
    },
  });
  return await prisma.$transaction([deleteIngredients, deleteRecipe]);
};
