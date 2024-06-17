import type { LinksFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { RecipesDisplay } from "~/route-components/recipesDisplay";
import stylesheet from "~/tailwind.css?url";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
type LoaderProps = {
  request: Request;
};
export const loader = async ({ request }: LoaderProps) => {
  const user = await getUser(request);
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
  };
  return data;
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const { recipes, user } = useLoaderData<LoaderType>();
  return (
    <div className="p-4 ">
      {user && (
        <p className="text-lg font-medium text-violet-800">
          Welcome, {user?.username}!
        </p>
      )}
      <div className="flex ">
        <Link
          to="/recipes/new"
          className="text-xl p-4 bg-sky-300 font-medium rounded-md mr-4 hover:bg-sky-500"
        >
          Add New Recipe
        </Link>
        <Link
          to="/inventory"
          className="text-xl p-4 bg-sky-300 font-medium rounded-md mx-4 hover:bg-sky-500"
        >
          View Inventory
        </Link>
        {!user ? (
          <Link
            to="/login"
            className="text-xl p-4 bg-sky-300 font-medium rounded-md mx-4 hover:bg-sky-500"
          >
            Login
          </Link>
        ) : (
          <form action="/logout" method="POST">
            <button
              className="text-xl p-4 bg-sky-300 font-medium rounded-md mx-4 hover:bg-sky-500"
              type="submit"
            >
              Logout
            </button>
          </form>
        )}
      </div>

      <h1 className="text-center text-4xl font-medium">My Recipes</h1>
      <div className="flex flex-row gap-8 mt-8 flex-wrap justify-center">
        <RecipesDisplay recipes={recipes} />
      </div>
    </div>
  );
}
