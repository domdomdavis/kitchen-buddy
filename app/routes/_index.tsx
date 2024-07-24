import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
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
  };
  return data;
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const { recipes, inventory } = useLoaderData<LoaderType>();
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[]>(recipes);
  const filterRecipes = () => {
    const availableRecipes: RecipeType[] = [];
    recipes.map((recipe) => {
      const availableIngredients: IngredientType[] = [];
      recipe.ingredients.map((ingredient) => {
        const iceWaterOrOptional =
          ingredient.ingredient.toLowerCase() === "ice" ||
          ingredient.ingredient.toLowerCase().includes(" ice") ||
          ingredient.ingredient.toLowerCase().includes(" water ") ||
          ingredient.ingredient.toLowerCase().includes("optional");

        const strippedIngredient = ingredient.ingredient
          .toLowerCase()
          .replace(/[\s~`*();:"',-]/g, "");
        inventory.map((item) => {
          const strippedItem = item.item
            .replace(/[\s~`*();:"',-]/g, "")
            .toLowerCase();
          if (
            strippedIngredient.includes(strippedItem) ||
            strippedIngredient.includes(pluralize.singular(strippedItem)) ||
            iceWaterOrOptional
          )
            availableIngredients.push(ingredient);
        });
      });
      const ingredientsWithoutDupes = new Set(availableIngredients);
      const recipeIngredientsWithoutDupes = new Set(recipe.ingredients);
      if (ingredientsWithoutDupes.size === recipeIngredientsWithoutDupes.size)
        availableRecipes.push(recipe);
    });
    setFilteredRecipes(availableRecipes);
  };
  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-4xl font-semibold">My Recipes</h1>
        <button className="p-2" onClick={filterRecipes}>
          filter recipes I can make
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
