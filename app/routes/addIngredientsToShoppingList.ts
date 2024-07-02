import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import {
  FoodItemType,
  IngredientType,
  ShoppingListType,
} from "~/helpers/types";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const foodItems = await db.foodItem.findMany();
  const currentShoppingList = await db.shoppingList.findMany();
  const { formData } = await request.json();
  if (user) {
    const ingredientNamesUnique = new Set<string>(
      formData.map((ingredient: IngredientType) => ingredient.ingredient)
    );
    const ingredients = Array.from(ingredientNamesUnique);
    const matchingFoodItems = ingredients.map(
      (ingredient) =>
        foodItems
          .filter((item) =>
            ingredient.toLowerCase().includes(item.product.toLowerCase())
          )
          .sort((a, b) => b.product.length - a.product.length)[0]
    );
    const items: { item: string; user_id: string }[] = [];

    matchingFoodItems.map((item) => {
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
