import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (user) {
    const newInventoryItem = await prisma.inventory.create({
      data: {
        user_id: user.id,
        item: formData.item,
      },
    });
    await prisma.shoppingList.delete({
      where: {
        id: formData.id,
      },
    });
    return newInventoryItem;
  }
};
