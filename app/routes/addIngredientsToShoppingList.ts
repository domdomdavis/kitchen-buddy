import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { matchIngredientsToFoodItems } from "~/helpers/matchIngredientsToFoodItems";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const currentShoppingList = await db.shoppingList.findMany();
  const foodItems = await db.foodItem.findMany();

  const { formData } = await request.json();
  if (user) {
    const matchingFoodItems = await matchIngredientsToFoodItems({
      ingredients: formData,
      foodItems,
    });
    const items: { item: string; user_id: string }[] = [];
    const dedupedFoodItems = new Set(matchingFoodItems);
    [...dedupedFoodItems].map((item) => {
      if (
        item &&
        !currentShoppingList.find((listItem) => listItem.item === item.product)
      ) {
        items.push({ item: item.product, user_id: user.id });
      }
    });
    const newListItems = await prisma.shoppingList.createMany({
      data: items,
      skipDuplicates: true,
    });
    return newListItems;
  }
};
