import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { EditModeRecipe } from "~/route-components/editModeRecipe";
import { IngredientDisplay } from "~/route-components/ingredientDisplay";
import { IngredientWithComponentDisplay } from "~/route-components/ingredientWithComponentDisplay";
import { InstructionsDisplay } from "~/route-components/instructionsDisplay";
import { ReadOnlyRecipe } from "~/route-components/readOnlyRecipe";
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
    <div className="p-8">
      <div className="flex w-full">
        <Link to="/" className="text-xl pl-8">
          Back
        </Link>
        <button className="text-xl mx-auto" onClick={() => setEditMode(true)}>
          Edit Recipe
        </button>
        <button className="text-xl mx-auto">Delete Recipe</button>
      </div>
      {!editMode ? (
        <ReadOnlyRecipe
          recipe={recipe}
          recipeHasComponents={recipeHasComponents}
        />
      ) : (
        <EditModeRecipe
          recipe={recipe}
          recipeHasComponents={recipeHasComponents}
        />
      )}
    </div>
  );
}
