import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { DeleteIcon } from "~/common-components/svg/deleteIcon";
import { EditIcon } from "~/common-components/svg/editIcon";
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
    }
  };
  useEffect(() => {
    if (fetcher.data) navigate("/");
  }, [fetcher.data]);
  return (
    <div>
      <div className="flex lg:hidden justify-end my-2">
        <button
          className="mr-4 border-2 border-sky-300 hover:bg-emerald-400 p-2 rounded-md"
          onClick={() => setEditMode(!editMode)}
        >
          <EditIcon />
        </button>
        <button
          className="mr-4 border-2 border-red-500 hover:bg-red-400 p-2 rounded-md"
          onClick={deleteRecipe}
        >
          <DeleteIcon />
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
