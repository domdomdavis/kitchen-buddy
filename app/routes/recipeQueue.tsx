import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { LoadingSpinner } from "~/common-components/loadingSpinner";
import { DeleteIcon } from "~/common-components/svg/deleteIcon";
import { findMissingIngredients } from "~/helpers/findMissingIngredients";
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
  const navigation = useNavigation();
  const inventory = data.inventory;
  const foodItems = data.foodItems;

  const getMissingFoodItems = (ingredients: IngredientType[]) => {
    const missingIngredients = findMissingIngredients({
      ingredients,
      inventory,
      foodItems,
      excludeOptional: true,
    });
    return missingIngredients;
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
                <div className="justify-between">
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
                        {recipe.missingIngredients.map((ingredient, index) => (
                          <li key={index}>&#x2022; {ingredient}</li>
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
                  <div>
                    <button
                      className="border-2 border-red-300 rounded-md p-2"
                      type="submit"
                      name="remove"
                      id="remove"
                      value={recipe.recipe.id}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          );
        })}
      {navigation.state !== "idle" && (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
