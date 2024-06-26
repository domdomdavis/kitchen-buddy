import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const updatedIngredients = await prisma.ingredientList.updateMany({
    where: {
      component: formData.oldComponent,
      recipe_id: formData.recipe_id,
    },
    data: {
      component: formData.newComponent,
    },
  });
  return updatedIngredients;
};
