import type { LinksFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export const loader = async () => {
  const data = {
    recipes: await db.recipe.findMany(),
    ingredientsLists: await db.ingredientList.findMany(),
  };

  return data;
};
const generateRecipeDisplay = (recipes) => {
  return recipes.map((recipe) => (
    <div key={recipe.id} className="flex flex-col w-96 h-96">
      <Link to={`/recipes/${recipe.id}`}>
        <p className="font-semibold text-xl text-center" key={recipe.id}>
          {recipe.title}
        </p>
        <img
          src={recipe.photo_url}
          className="object-scale-down border-4 border-violet-400 rounded-md"
        />
      </Link>
    </div>
  ));
};
export default function Index() {
  const data = useLoaderData();
  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-medium">My Recipes</h1>
      <div className="flex flex-row gap-8 mt-8 flex-wrap">
        {" "}
        {generateRecipeDisplay(data.recipes)}
      </div>
    </div>
  );
}
