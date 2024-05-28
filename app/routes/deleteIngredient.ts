import { PrismaClient } from "@prisma/client";

type ActionProps = {
  request: Request;
};

export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (formData.id === null) throw new Error();
  return await prisma.ingredientList.delete({
    where: {
      id: formData.id,
    },
  });
};
