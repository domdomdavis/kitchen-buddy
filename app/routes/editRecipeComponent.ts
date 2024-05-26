import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};
export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const updatedIngredients = await prisma.ingredientList.updateMany({
    where: {
      component: formData.oldComponent,
    },
    data: {
      component: formData.newComponent,
    },
  });
  return updatedIngredients;
};
