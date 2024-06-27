import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (user) {
    const updatedList = await prisma.shoppingList.update({
      where: {
        id: formData.id,
      },
      data: {
        user_id: user.id,
        item: formData.item,
        amount: formData.amount,
        store: formData.store,
      },
    });
    return updatedList;
  }
};
