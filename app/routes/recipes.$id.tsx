import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { IngredientDisplay } from "~/route-components/ingredientDisplay";
import { IngredientWithComponentDisplay } from "~/route-components/ingredientWithComponentDisplay";
import { InstructionsDisplay } from "~/route-components/instructionsDisplay";
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
  return { recipe };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeDetails() {
  const { recipe } = useLoaderData<LoaderType>();
  const recipeHasComponents = recipe?.ingredients.find(
    (ingredient) => ingredient.component !== null
  );
  return (
    <div className="p-8">
      <Link to="/" className="text-xl pl-8">
        Back
      </Link>
      <h1 className="text-4xl font-semibold p-8">{recipe?.title}</h1>
      <div className="flex">
        <span className="h-108 w-96 p-8">
          <img src={recipe?.photo_url} className="object-scale-down" />
        </span>
        <span className="p-8">
          {recipeHasComponents ? (
            <IngredientWithComponentDisplay
              ingredients={recipe?.ingredients ?? []}
            />
          ) : (
            <IngredientDisplay ingredients={recipe?.ingredients ?? []} />
          )}
        </span>
      </div>
      <div className="p-8 flex flex-col flex-wrap w-1/2">
        <InstructionsDisplay instructions={recipe?.instructions} />
      </div>
    </div>
  );
}
