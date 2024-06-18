import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Recipe } from "~/route-components/recipe";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  const recipe = await db.recipe.findUnique({
    where: {
      id: params.id,
    },
    include: {
      ingredients: true,
    },
  });
  const inventory = await db.inventory.findMany({
    where: {
      user_id: user?.id,
    },
  });
  if (!recipe) throw redirect("/");
  return { recipe, inventory };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeDetails() {
  const { recipe, inventory } = useLoaderData<LoaderType>();
  const navigate = useNavigate();
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
      navigate("/");
    }
  };
  return (
    <div>
      <div className="flex lg:hidden justify-end my-2">
        <button
          className="mr-4 border-2 border-sky-300 hover:bg-emerald-400 p-2 rounded-md"
          onClick={() => setEditMode(!editMode)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 26 26"
          >
            <path d="M 20.09375 0.25 C 19.5 0.246094 18.917969 0.457031 18.46875 0.90625 L 17.46875 1.9375 L 24.0625 8.5625 L 25.0625 7.53125 C 25.964844 6.628906 25.972656 5.164063 25.0625 4.25 L 21.75 0.9375 C 21.292969 0.480469 20.6875 0.253906 20.09375 0.25 Z M 16.34375 2.84375 L 14.78125 4.34375 L 21.65625 11.21875 L 23.25 9.75 Z M 13.78125 5.4375 L 2.96875 16.15625 C 2.71875 16.285156 2.539063 16.511719 2.46875 16.78125 L 0.15625 24.625 C 0.0507813 24.96875 0.144531 25.347656 0.398438 25.601563 C 0.652344 25.855469 1.03125 25.949219 1.375 25.84375 L 9.21875 23.53125 C 9.582031 23.476563 9.882813 23.222656 10 22.875 L 20.65625 12.3125 L 19.1875 10.84375 L 8.25 21.8125 L 3.84375 23.09375 L 2.90625 22.15625 L 4.25 17.5625 L 15.09375 6.75 Z M 16.15625 7.84375 L 5.1875 18.84375 L 6.78125 19.1875 L 7 20.65625 L 18 9.6875 Z"></path>
          </svg>
        </button>
        <button
          className="mr-4 border-2 border-red-500 hover:bg-red-400 p-2 rounded-md"
          onClick={deleteRecipe}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
          </svg>
        </button>
      </div>
      <div className="hidden lg:flex w-full justify-end mt-8">
        <button
          className="text-xl lg:mr-8 p-4 bg-gradient-to-r from-sky-300 to-teal-300 rounded-md font-semibold"
          onClick={() => setEditMode(!editMode)}
        >
          {!editMode ? "Edit Recipe" : "Stop Editing"}
        </button>
        <button
          className="text-xl lg:mr-8 p-4 border-red-500 border-2 text-red-500 rounded-md font-semibold"
          onClick={deleteRecipe}
        >
          Delete Recipe
        </button>
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
