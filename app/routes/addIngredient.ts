import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};

export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (formData.recipe_id === "") throw new Error();
  return await prisma.ingredientList.create({
    data: {
      amount: formData.amount,
      ingredient: formData.ingredient,
      recipe_id: formData.recipe_id,
    },
  });
};
