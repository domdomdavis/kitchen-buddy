import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};
export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const updatedIngredient = await prisma.ingredientList.update({
    where: {
      id: formData.id,
    },
    data: {
      amount: formData.amount,
      ingredient: formData.ingredient,
      component: formData.component ?? null,
    },
  });
  return updatedIngredient;
};
