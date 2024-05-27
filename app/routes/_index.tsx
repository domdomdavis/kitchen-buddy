import type { LinksFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { RecipeType } from "~/helpers/types";
import { RecipesDisplay } from "~/route-components/recipesDisplay";
import stylesheet from "~/tailwind.css?url";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export const loader = async () => {
  const data = {
    recipes: await db.recipe.findMany({
      include: {
        ingredients: true,
      },
    }),
  };

  return data;
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const data = useLoaderData<LoaderType>();
  return (
    <div className="p-8">
      <Link to="/recipes/new" className="text-xl">
        Add New Recipe
      </Link>
      <h1 className="text-center text-4xl font-medium">My Recipes</h1>
      <div className="flex flex-row gap-8 mt-8 flex-wrap">
        <RecipesDisplay recipes={data.recipes} />
      </div>
    </div>
  );
}
