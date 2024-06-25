import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  return await prisma.recipeNote.delete({
    where: {
      id: formData.id,
    },
  });
};
