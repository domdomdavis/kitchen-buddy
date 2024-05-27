import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { IngredientDisplay } from "~/route-components/ingredientDisplay";
import { IngredientWithComponentDisplay } from "~/route-components/ingredientWithComponentDisplay";
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
  if (!recipe) throw redirect("/");
  return { recipe };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeDetails() {
  const { recipe } = useLoaderData<LoaderType>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const recipeHasComponents = recipe?.ingredients.some(
    (ingredient) => ingredient.component !== null
  );
  return (
    <div>
      <div className="flex w-full justify-between">
        <Link
          to="/"
          className="text-xl mt-8 ml-8 p-4 bg-violet-300 rounded-md font-medium"
        >
          Back to Home
        </Link>
        <div>
          <button
            className="text-xl mt-8 mr-8 p-4 bg-violet-300 rounded-md font-medium"
            onClick={() => setEditMode(!editMode)}
          >
            {!editMode ? "Edit Recipe" : "Stop Editing"}
          </button>
          <button className="text-xl mt-8 mr-8 p-4 border-red-500 border-2 text-red-500 rounded-md font-medium">
            Delete Recipe
          </button>
        </div>
      </div>
      <Recipe
        recipe={recipe}
        recipeHasComponents={recipeHasComponents}
        editMode={editMode}
      />
    </div>
  );
}
