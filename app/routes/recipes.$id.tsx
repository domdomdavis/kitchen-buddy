import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { HomeButton } from "~/common-components/homeButton";
import { IngredientDisplay } from "~/route-components/ingredients/ingredientDisplay";
import { Recipe } from "~/route-components/recipe";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const recipe = await db.recipe.findUnique({
    where: {
      id: params.id,
    },
    include: {
      ingredients: true,
    },
  });
  const inventory = await db.inventory.findMany();
  if (!recipe) throw redirect("/");
  return { recipe, inventory };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeDetails() {
  const { recipe, inventory } = useLoaderData<LoaderType>();
  const fetcher = useFetcher();
  const [editMode, setEditMode] = useState<boolean>(false);
  const recipeHasComponents = recipe?.ingredients.some(
    (ingredient) => ingredient.component !== null
  );

  const deleteRecipe = async () => {
    const areYouSure = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (areYouSure) {
      fetcher.submit(
        {
          formData: { id: recipe.id },
        },
        { method: "POST", action: "/deleteRecipe", encType: "application/json" }
      );
    }
  };
  return (
    <div>
      <div className="flex w-full justify-between mt-8">
        <HomeButton />
        <div>
          <button
            className="text-xl mr-8 p-4 bg-violet-300 rounded-md font-medium"
            onClick={() => setEditMode(!editMode)}
          >
            {!editMode ? "Edit Recipe" : "Stop Editing"}
          </button>
          <button
            className="text-xl mr-8 p-4 border-red-500 border-2 text-red-500 rounded-md font-medium"
            onClick={deleteRecipe}
          >
            Delete Recipe
          </button>
        </div>
      </div>
      <Recipe
        recipe={recipe}
        recipeHasComponents={recipeHasComponents}
        editMode={editMode}
        inventory={inventory}
      />
    </div>
  );
}
