import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { RecipeType } from "~/helpers/types";
import { db } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  const matchingRecipes = await prisma.recipe.findMany({
    where: { id: { in: formData } },
  });
  return matchingRecipes;
}
export const loader = async () => {
  const inventory = await db.inventory.findMany();
  const ingredientList = await db.ingredientList.findMany();
  return { inventory, ingredientList };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Inventory() {
  const { inventory, ingredientList } = useLoaderData<LoaderType>();
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const fetcher = useFetcher();
  const findRecipes = (item: string) => {
    const recipeIds: string[] = [];
    ingredientList.map((ingredient) => {
      if (ingredient.ingredient.includes(item))
        recipeIds.push(ingredient.recipe_id);
    });
    fetcher.submit(
      {
        formData: recipeIds,
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };
  useEffect(() => {
    if (fetcher.data) {
      setRecipes(fetcher.data as RecipeType[]);
    }
  }, [fetcher.data]);

  return (
    <div className="p-8">
      <h1 className="text-center text-4xl font-medium">My Inventory</h1>
      {inventory.map((item) => (
        <button
          className="m-4 p-4 rounded-md bg-pink-300 font-medium text-xl"
          onClick={() => findRecipes(item.item)}
        >
          {item.item}
        </button>
      ))}
      {recipes.length > 0 && recipes.map((recipe) => <p>{recipe.title}</p>)}
    </div>
  );
}
