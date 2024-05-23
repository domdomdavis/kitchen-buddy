import { useLoaderData, useMatches, useParams } from "@remix-run/react";
import { IngredientDisplay } from "~/route-components/ingredientDisplay";
import { InstructionsDisplay } from "~/route-components/instructionsDisplay";
import { db } from "~/utils/db.server";

export const loader = async ({ params }) => {
  const recipe = await db.recipe.findUnique({
    where: {
      id: params.id,
    },
  });
  const ingredients = await db.ingredientList.findMany({
    where: {
      recipe_id: params.id,
    },
  });
  return { recipe, ingredients };
};

export default function RecipeDetails() {
  const { recipe, ingredients } = useLoaderData();
  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-semibold">{recipe.title}</h1>
      <div className="grid grid-cols-3">
        <img src={recipe.photo_url} className="w-96 h-108" />
        <IngredientDisplay ingredients={ingredients} />
        <InstructionsDisplay instructions={recipe.instructions} />
      </div>
    </div>
  );
}
