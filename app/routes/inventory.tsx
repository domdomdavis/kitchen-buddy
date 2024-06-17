import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { InventoryType, RecipeType } from "~/helpers/types";
import { RecipesDisplay } from "~/route-components/recipesDisplay";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
type RecipeFetcherType = {
  recipes: RecipeType[];
};

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (!formData.addingItem) {
    if (formData.removingItem) {
      return await prisma.inventory.delete({
        where: {
          id: formData.id,
        },
      });
    }
    const matchingRecipes = await prisma.recipe.findMany({
      where: {
        id: { in: formData.ids },
        user_id: user?.id,
      },
    });
    return { recipes: matchingRecipes };
  } else {
    if (user) {
      const newItem = await prisma.inventory.create({
        data: {
          item: formData.item,
          user_id: user.id,
        },
      });
      return newItem;
    }
  }
}
export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);

  const inventory = await db.inventory.findMany({
    where: {
      user_id: user?.id,
    },
  });
  const ingredientList = await db.ingredientList.findMany();
  return { inventory, ingredientList };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Inventory() {
  const { inventory, ingredientList } = useLoaderData<LoaderType>();
  const [itemList, setItemList] = useState(inventory);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [newItemInput, setNewItemInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [itemSelected, setItemSelected] = useState(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const findRecipes = (item: string) => {
    const recipeIds: string[] = [];
    ingredientList.map((ingredient) => {
      if (ingredient.ingredient.includes(item))
        recipeIds.push(ingredient.recipe_id);
    });
    fetcher.submit(
      {
        formData: { ids: recipeIds },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };
  const addItemToInventory = (item: string) => {
    fetcher.submit(
      {
        formData: { item, addingItem: true },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };
  const removeItemFromInventory = (item: InventoryType) => {
    fetcher.submit(
      {
        formData: { id: item.id, removingItem: true },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      const fetcherData = fetcher.data as RecipeFetcherType;
      if (fetcherData.recipes) setRecipes(fetcherData.recipes);
      else navigate(0);
    }
  }, [fetcher.data]);

  const searchInventory = (searchInput: string) => {
    const matching = inventory.filter((item) =>
      item.item.includes(searchInput)
    );
    setItemList(matching);
  };
  return (
    <div className="p-8">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-medium">My Inventory</h1>
        <div className="flex-row">
          {" "}
          <input
            placeholder="Add Item"
            className="m-4 p-4 border-2 border-orange-300 rounded-md"
            value={newItemInput}
            onChange={(e) => setNewItemInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                addItemToInventory(newItemInput);
                setNewItemInput("");
              }
            }}
          />
          <input
            placeholder="Search inventory"
            className="m-4 p-4 border-2 border-orange-300 rounded-md"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              searchInventory(searchInput);
              if (e.target.value === "") setItemList(inventory);
            }}
          />
        </div>

        <div className="flex-row">
          {itemList.map((item) => (
            <span className="mx-4 inline-block" key={item.id}>
              <button
                key={item.id}
                className="mt-3 p-4 rounded-md bg-fuchsia-300 font-medium text-xl hover:bg-fuchsia-500 focus:bg-gradient-to-r from-green-300 to-teal-300"
                onClick={() => {
                  setItemSelected(true);
                  findRecipes(item.item);
                }}
              >
                {item.item}
              </button>
              <button
                className="m-2 px-2 text-lg hover:bg-red-400 rounded-md"
                onClick={() => removeItemFromInventory(item)}
              >
                x
              </button>
            </span>
          ))}
        </div>

        {itemSelected &&
          (recipes.length > 0 ? (
            <div className="mt-8 flex space-x-4">
              <RecipesDisplay recipes={recipes} />
            </div>
          ) : (
            <div className="mt-8">No recipes for this ingredient.</div>
          ))}
      </div>
    </div>
  );
}
