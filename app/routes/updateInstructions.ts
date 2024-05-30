import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};
export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const updatedRecipe = await prisma.recipe.update({
    where: {
      id: formData.id,
    },
    data: {
      instructions: formData.instructions,
    },
  });
  return updatedRecipe;
};
