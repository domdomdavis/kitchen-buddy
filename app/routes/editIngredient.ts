import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const updatedIngredient = await prisma.ingredientList.update({
    where: {
      id: formData.id,
    },
    data: {
      ingredient: formData.ingredient,
    },
  });
  return updatedIngredient;
};
