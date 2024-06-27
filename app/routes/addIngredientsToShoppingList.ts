import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { IngredientType } from "~/helpers/types";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const items = formData.map((item: IngredientType) => {
    return { item: item.ingredient, user_id: user?.id };
  });
  const newListItems = await prisma.shoppingList.createMany({
    data: items,
    skipDuplicates: true,
  });
  return newListItems;
};
