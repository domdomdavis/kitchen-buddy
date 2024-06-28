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
  const [itemSelected, setItemSelected] = useState("");
  const [errorText, setErrorText] = useState("");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const findRecipes = (item: string) => {
    const recipeIds: string[] = [];
    ingredientList.map((ingredient) => {
      if (ingredient.ingredient.toLowerCase().includes(item.toLowerCase()))
        recipeIds.push(ingredient.recipe_id);
    });
    fetcher.submit(
      {
        formData: { ids: recipeIds },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
    document
      .getElementById("recipe-view")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  const addItemToInventory = (item: string) => {
    if (
      inventory.find(
        (foodItem) => foodItem.item.toLowerCase() === item.toLowerCase()
      )
    ) {
      setErrorText("Item already in inventory.");
    } else {
      fetcher.submit(
        {
          formData: { item, addingItem: true },
        },
        { method: "POST", action: "/inventory", encType: "application/json" }
      );
    }
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
      item.item.toLowerCase().includes(searchInput.toLowerCase())
    );
    setItemList(matching);
  };
  return (
    <div className="p-8">
      {errorText.length > 0 && <p>{errorText}</p>}
      <div className="lg:flex">
        <div className="w-full lg:w-1/4">
          <h1 className="text-2xl font-medium">My Inventory</h1>

          <input
            placeholder="Add Item"
            className="p-4 border-2 border-violet-300 rounded-md w-full my-2"
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
            className="p-4 border-2 border-violet-300 rounded-md w-full my-2"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              searchInventory(searchInput);
              if (e.target.value === "") setItemList(inventory);
            }}
          />
          {itemList
            .sort((a, b) => a.item.localeCompare(b.item))
            .map((item) => (
              <div
                className="border-b-2 border-cyan-200 flex justify-between group"
                key={item.id}
              >
                <button
                  key={item.id}
                  className="p-2 h-full w-full focus:bg-gradient-to-r from-green-300 to-teal-300 text-left focus:font-semibold rounded-md"
                  onClick={() => {
                    setItemSelected(item.item);
                    findRecipes(item.item);
                  }}
                >
                  {item.item.toLowerCase()}
                </button>
                <button
                  className="text-sm invisible group-hover:visible text-gray-700 hover:border-2 border-red-500 rounded-md"
                  onClick={() => removeItemFromInventory(item)}
                >
                  remove item
                </button>
              </div>
            ))}
        </div>
        <div className="lg:m-8 w-full justify-center" id="recipe-view">
          {itemSelected ? (
            recipes.length > 0 ? (
              <div>
                <h2 className="lg:text-center text-3xl font-medium my-4">
                  Recipes with {itemSelected}
                </h2>
                <div className="lg:m-8 xl:grid xl:grid-cols-3">
                  <RecipesDisplay recipes={recipes} />
                </div>
              </div>
            ) : (
              <div className="lg:text-center text-xl font-medium">
                No recipes for this ingredient.
              </div>
            )
          ) : (
            <div className="lg:ext-center text-xl font-medium">
              Select an item to view recipes with that ingredient.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
