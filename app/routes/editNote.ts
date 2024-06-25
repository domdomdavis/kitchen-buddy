import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const updatedNote = await prisma.recipeNote.update({
    where: {
      id: formData.id,
    },
    data: {
      body: formData.body,
      date_updated: new Date(),
    },
  });
  return updatedNote;
};
