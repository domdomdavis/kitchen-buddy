import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { HomeButton } from "~/common-components/homeButton";
import { IngredientDisplay } from "~/route-components/ingredients/ingredientDisplay";
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
      <div className="flex w-full justify-between mt-8">
        <HomeButton />
        <div className="hidden lg:flex">
          <button
            className="text-xl lg:mr-8 p-4 bg-sky-300 rounded-md font-medium"
            onClick={() => setEditMode(!editMode)}
          >
            {!editMode ? "Edit Recipe" : "Stop Editing"}
          </button>
          <button
            className="text-xl lg:mr-8 p-4 border-red-500 border-2 text-red-500 rounded-md font-medium"
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
