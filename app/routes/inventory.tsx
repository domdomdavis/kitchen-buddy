import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { InventoryType, RecipeType } from "~/helpers/types";
import { RecipesDisplay } from "~/route-components/recipesDisplay";
import { db } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (!formData.addingItem) {
    const matchingRecipes = await prisma.recipe.findMany({
      where: { id: { in: formData.ids } },
    });
    return matchingRecipes;
  } else {
    const newItem = await prisma.inventory.create({
      data: {
        item: formData.item,
      },
    });
    return newItem;
  }
}
export const loader = async () => {
  const inventory = await db.inventory.findMany();
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
  const recipeFetcher = useFetcher();
  const addItemFetcher = useFetcher();
  const findRecipes = (item: string) => {
    const recipeIds: string[] = [];
    ingredientList.map((ingredient) => {
      if (ingredient.ingredient.includes(item))
        recipeIds.push(ingredient.recipe_id);
    });
    recipeFetcher.submit(
      {
        formData: { ids: recipeIds, addingItem: false },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };
  const addItemToInventory = (item: string) => {
    addItemFetcher.submit(
      {
        formData: { item, addingItem: true },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };
  useEffect(() => {
    if (recipeFetcher.data) {
      setRecipes(recipeFetcher.data as RecipeType[]);
    } else if (addItemFetcher.data) {
      itemList.push(addItemFetcher.data as InventoryType);
      setItemList([...itemList]);
    }
  }, [recipeFetcher.data, addItemFetcher.data]);

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
            <button
              key={item.id}
              className="m-4 p-4 rounded-md bg-pink-300 font-medium text-xl"
              onClick={() => findRecipes(item.item)}
            >
              {item.item}
            </button>
          ))}
        </div>

        {recipes.length > 0 && (
          <div className="flex space-x-4">
            <RecipesDisplay recipes={recipes} />
          </div>
        )}
      </div>
    </div>
  );
}
