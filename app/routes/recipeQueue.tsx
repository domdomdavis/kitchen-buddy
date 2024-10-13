import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { findMissingIngredients } from "~/helpers/findMissingIngredients";
import { matchIngredientsToFoodItems } from "~/helpers/matchIngredientsToFoodItems";
import { IngredientType } from "~/helpers/types";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const form = await request.formData();
  const recipeId = form.get("remove")?.toString();
  const updated = await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      in_queue: false,
    },
  });
  return updated;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) throw redirect("/login");
  const data = {
    user,
    recipes: await db.recipe.findMany({
      where: {
        user_id: user?.id,
        in_queue: true,
      },
      include: {
        ingredients: true,
      },
    }),
    inventory: await db.inventory.findMany({
      where: {
        user_id: user?.id,
      },
    }),
    foodItems: await db.foodItem.findMany(),
  };
  return data;
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeQueue() {
  const data = useLoaderData<LoaderType>();
  const inventory = data.inventory;

  const getMissingFoodItems = (ingredients: IngredientType[]) => {
    const missingIngredients = findMissingIngredients({
      ingredients,
      inventory,
    });
    const foodItems = matchIngredientsToFoodItems({
      ingredients: missingIngredients,
      foodItems: data.foodItems,
    });
    return foodItems;
  };

  const recipes = data.recipes.map((recipe) => {
    const missingIngredients = getMissingFoodItems(recipe.ingredients);
    return { recipe, missingIngredients };
  });

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-semibold text-3xl mt-2">Recipe Queue</h1>
      {recipes
        .sort(
          (a, b) => a.missingIngredients.length - b.missingIngredients.length
        )
        .map((recipe, index) => {
          return (
            <div
              className="p-4 w-full lg:w-2/3 flex border-b-2 justify-between"
              key={index}
            >
              <Link to={`/recipes/${recipe.recipe.id}`}>
                <div>
                  <span className="text-xl font-medium">
                    {recipe.recipe.title}
                  </span>
                  {recipe.missingIngredients.length > 0 ? (
                    <span className="text-red-500 ml-2 font-bold">!</span>
                  ) : (
                    <span className="text-green-500 ml-2 font-bold">✓</span>
                  )}
                </div>
                <div className="flex mt-2">
                  <img
                    src={recipe.recipe.photo_url}
                    className="h-44 w-44 object-cover rounded-md"
                  />
                  {recipe.missingIngredients.length > 0 && (
                    <div className="mx-4 my-2">
                      <p className="font-medium">Missing Ingredients:</p>
                      <ul>
                        {recipe.missingIngredients.map((ingredient) => (
                          <li key={ingredient.id}>
                            &#x2022; {ingredient.product}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <p className="pt-2">
                    Total time: {recipe.recipe.total_time ?? ""}
                  </p>
                </div>
              </Link>
              <div>
                <Form method="POST">
                  <button
                    type="submit"
                    name="remove"
                    id="remove"
                    value={recipe.recipe.id}
                  >
                    remove from queue
                  </button>
                </Form>
              </div>
            </div>
          );
        })}
    </div>
  );
}
