import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "~/common-components/loadingSpinner";
import { DeleteIcon } from "~/common-components/svg/deleteIcon";
import { EditIcon } from "~/common-components/svg/editIcon";
import { Recipe } from "~/route-components/recipe";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const form = await request.formData();
  const id = form.get("addToQueue")?.toString() ?? "";
  const updated = await prisma.recipe.update({
    where: {
      id: id,
    },
    data: {
      in_queue: true,
    },
  });
  return updated;
};
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) throw redirect("/login");
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
  const foodItems = await db.foodItem.findMany();
  const allRecipes = await db.recipe.findMany({
    where: {
      user_id: user?.id,
    },
    select: {
      title: true,
      id: true,
    },
  });

  if (!recipe) throw redirect("/");
  return { recipe, inventory, foodItems, allRecipes };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function RecipeDetails() {
  const { recipe, inventory, foodItems, allRecipes } =
    useLoaderData<LoaderType>();
  useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
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
      <div className="flex justify-end my-2">
        {navigation.state !== "idle" ? (
          <LoadingSpinner />
        ) : !recipe.in_queue ? (
          <Form method="POST">
            <button
              id="addToQueue"
              name="addToQueue"
              value={recipe.id}
              type="submit"
              className="mr-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 p-2 rounded-md font-semibold"
            >
              Add to Recipe Queue
            </button>
          </Form>
        ) : (
          <p className="mr-4 p-2 font-semibold">Recipe in Queue!</p>
        )}
        <button
          className="mr-4 border-2 border-sky-300  p-2 rounded-md"
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
      <Recipe
        recipe={recipe}
        recipeHasComponents={recipeHasComponents}
        editMode={editMode}
        inventory={inventory}
        foodItems={foodItems}
        allRecipes={allRecipes}
      />
    </div>
  );
}
