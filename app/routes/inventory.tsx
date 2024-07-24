import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "~/common-components/confirmDialog";
import { InventoryType, RecipeType } from "~/helpers/types";
import { RecipesDisplay } from "~/route-components/recipesDisplay";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type FetcherDataType = {
  inventory?: InventoryType[];
  recipes?: RecipeType[];
};

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const { formData } = await request.json();
  if (user) {
    if (formData.addingItem) {
      const newItem = await prisma.inventory.create({
        data: {
          item: formData.item,
          user_id: user.id,
        },
      });
      return newItem;
    } else if (formData.removingItem) {
      if (formData.addToShoppingList) {
        const currentShoppingList = await db.shoppingList.findMany();
        if (
          !currentShoppingList.find(
            (listItem) =>
              listItem.item.toLowerCase() === formData.item.toLowerCase()
          )
        ) {
          await prisma.shoppingList.create({
            data: {
              item: formData.item,
              user_id: user.id,
            },
          });
        }
      }
      return await prisma.inventory.delete({
        where: {
          id: formData.id,
        },
      });
    } else if (formData.findRecipes) {
      const matchingRecipes = await prisma.recipe.findMany({
        where: {
          id: { in: formData.ids },
          user_id: user?.id,
        },
      });
      return { recipes: matchingRecipes };
    } else if (formData.viewPerishables) {
      const foodItems = await db.foodItem.findMany({
        where: { perishable: true },
      });
      const perishables: InventoryType[] = [];
      if (foodItems) {
        formData.inventory.map((item: InventoryType) => {
          const found = foodItems.find((product) =>
            product.product.toLowerCase().includes(item.item.toLowerCase())
          );
          if (
            found &&
            item.item.length > 3 &&
            item.item.toLowerCase() !== "salt"
          )
            perishables.push(item);
        });
      }
      return { inventory: perishables };
    }
  }
}
export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);
  if (!user) throw redirect("/login");
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
  const [filteringItems, setFilteringItems] = useState(false);
  const [newItemInput, setNewItemInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [itemSelected, setItemSelected] = useState<InventoryType>();
  const [openModal, setOpenModal] = useState(false);
  const [errorText, setErrorText] = useState("");
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();

  const findRecipes = (item: string) => {
    const strippedItem = item.replace(/[\s~`*();:"',-]/g, "").toLowerCase();
    const itemSingular = pluralize.singular(strippedItem);
    const recipeIds: string[] = [];
    ingredientList.map((ingredient) => {
      const strippedIngredient = ingredient.ingredient
        .replace(/[\s~`*();:"',-]/g, "")
        .toLowerCase();

      if (
        strippedIngredient.includes(strippedItem) ||
        strippedIngredient.includes(itemSingular)
      )
        recipeIds.push(ingredient.recipe_id);
    });
    fetcher.submit(
      {
        formData: { ids: recipeIds, findRecipes: true },
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
  const removeItemFromInventory = (
    item: InventoryType,
    addToShoppingList?: boolean
  ) => {
    fetcher.submit(
      {
        formData: {
          id: item.id,
          item: item.item,
          removingItem: true,
          addToShoppingList: addToShoppingList ?? false,
        },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      const fetcherData = fetcher.data as FetcherDataType;
      if (fetcherData.inventory) {
        setItemList(fetcherData.inventory);
      } else if (fetcherData.recipes) {
        setRecipes(fetcherData.recipes);
      } else navigate(0);
    }
  }, [fetcher.data]);

  const searchInventory = (searchInput: string) => {
    const matching = inventory.filter((item) =>
      item.item.toLowerCase().includes(searchInput.toLowerCase())
    );
    setItemList(matching);
  };

  const filterPerishables = () => {
    fetcher.submit(
      {
        formData: { inventory, viewPerishables: true },
      },
      { method: "POST", action: "/inventory", encType: "application/json" }
    );
  };
  return (
    <div className="p-8">
      {errorText.length > 0 && <p>{errorText}</p>}
      <div className="lg:flex">
        <div className="w-full lg:w-1/4">
          <div className="flex justify-between">
            {" "}
            <h1 className="text-2xl font-medium">My Inventory</h1>
            <button
              onClick={() => {
                if (!filteringItems) {
                  setFilteringItems(true);
                  filterPerishables();
                } else {
                  setFilteringItems(false);
                  setItemList(inventory);
                }
              }}
            >
              {!filteringItems ? "view perishables only" : "view all items"}
            </button>
          </div>

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
                  className="p-2 text-left focus:font-semibold focus:border-b-2 border-fuchsia-500"
                  onClick={() => {
                    setItemSelected(item);
                    findRecipes(item.item);
                  }}
                >
                  {item.item.toLowerCase()}
                </button>
                <button
                  className="text-sm p-2 invisible group-hover:visible text-gray-700 hover:border-2 border-red-500 rounded-md"
                  onClick={() => {
                    setItemSelected(item);
                    setOpenModal(true);
                  }}
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
                  Recipes with {itemSelected.item}
                </h2>
                <div className="lg:m-8 xl:grid xl:grid-cols-3">
                  <RecipesDisplay recipes={recipes} />
                </div>
              </div>
            ) : (
              <div className="lg:text-center text-xl font-medium">
                No recipes with {itemSelected.item}.
              </div>
            )
          ) : (
            <div className="lg:text-center text-xl font-medium">
              Select an item to view recipes with that ingredient.
            </div>
          )}
        </div>
      </div>
      {openModal && itemSelected && (
        <ConfirmDialog
          removeItem={removeItemFromInventory}
          selectedItem={itemSelected}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
