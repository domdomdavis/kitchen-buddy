import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { findMissingIngredients } from "~/helpers/findMissingIngredients";
import { IngredientType, RecipeType } from "~/helpers/types";
import { RecipesDisplay } from "~/route-components/recipesDisplay";
import stylesheet from "~/tailwind.css?url";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) throw redirect("/login");
  const data = {
    user,
    recipes: await db.recipe.findMany({
      where: {
        user_id: user?.id,
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

export default function Index() {
  const { recipes, inventory, foodItems } = useLoaderData<LoaderType>();
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[]>(recipes);
  const [recipesFiltered, setRecipesFiltered] = useState(false);
  const filterRecipes = () => {
    const availableRecipes: RecipeType[] = [];
    recipes.map((recipe) => {
      const ingredients = recipe.ingredients;
      const missingIngredients = findMissingIngredients({
        ingredients,
        inventory,
        foodItems,
        excludeOptional: true,
      });
      if (missingIngredients.length === 0) {
        availableRecipes.push(recipe);
      }
    });
    setFilteredRecipes(availableRecipes);
  };
  const filterButtonText = !recipesFiltered
    ? "see recipes I can make"
    : "see all recipes";
  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-4xl font-semibold">My Recipes</h1>
        <button
          className="p-2 border-2 rounded-md mt-2 font-medium border-green-300"
          onClick={() => {
            if (!recipesFiltered) filterRecipes();
            else setFilteredRecipes(recipes);
            setRecipesFiltered(!recipesFiltered);
          }}
        >
          {filterButtonText}
        </button>
        <input
          placeholder="Search recipes..."
          onChange={(e) => {
            setFilteredRecipes(
              recipes.filter((recipe) =>
                recipe.title
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase())
              )
            );
          }}
          className="place-self-center border-2 border-sky-300 rounded-md p-2 mt-4 w-3/4 lg:w-1/2 2xl:w-1/5"
        />
      </div>

      <div className="flex flex-row gap-8 mt-8 flex-wrap justify-center">
        <RecipesDisplay recipes={filteredRecipes} />
      </div>
    </div>
  );
}
