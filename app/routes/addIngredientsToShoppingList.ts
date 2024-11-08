import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { ShoppingListType } from "~/helpers/types";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const currentShoppingList = await db.shoppingList.findMany({
    where: { user_id: user?.id },
  });
  const { formData } = await request.json();
  if (user) {
    const items = formData.map((newItem: string) => {
      if (!currentShoppingList.find((item) => item.item === newItem)) {
        return {
          item: newItem,
          user_id: user.id,
        };
      }
    });
    const newItems = items.filter(
      (item: ShoppingListType) => item !== undefined
    );
    const newListItems = await prisma.shoppingList.createMany({
      data: newItems,
      skipDuplicates: true,
    });
    return newListItems;
  }
};
