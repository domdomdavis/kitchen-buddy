import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { IngredientDisplay } from "~/route-components/ingredientDisplay";
import { InstructionsDisplay } from "~/route-components/instructionsDisplay";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
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
export type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeDetails() {
  const { recipe, ingredients } = useLoaderData<LoaderType>();
  return (
    <div className="p-8">
      {" "}
      <Link to="/" className="text-xl pl-8">
        Back
      </Link>
      <h1 className="text-4xl font-semibold p-8">{recipe?.title}</h1>
      <div className="flex">
        <span className="h-108 w-96 p-8">
          <img src={recipe?.photo_url} className="object-scale-down" />
        </span>
        <span className="p-8">
          <IngredientDisplay ingredients={ingredients} />
        </span>
      </div>
      <div className="p-8 flex flex-col flex-wrap">
        <InstructionsDisplay instructions={recipe?.instructions} />
      </div>
    </div>
  );
}
