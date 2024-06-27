import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ShoppingListType } from "~/helpers/types";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await getUser(request);
  const prisma = new PrismaClient();
  const form = await request.formData();
  const item = form.get("item")?.toString();
  const amount = form.get("amount")?.toString();
  const store = form.get("store")?.toString();
  if (user && item) {
    const newItem = await prisma.shoppingList.create({
      data: {
        user_id: user.id,
        item,
        amount,
        store,
      },
    });
    return newItem;
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const shoppingList = await db.shoppingList.findMany({
    where: {
      user_id: user?.id,
    },
  });
  const inventory = await db.inventory.findMany({
    where: {
      user_id: user?.id,
    },
  });
  return { shoppingList, inventory };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function ShoppingList() {
  const { shoppingList, inventory } = useLoaderData<LoaderType>();
  const [selectedItem, setSelectedItem] = useState<ShoppingListType | null>(
    null
  );
  const fetcher = useFetcher();

  const removeItem = (item: ShoppingListType) => {
    if (item) {
      fetcher.submit(
        { formData: item },
        {
          method: "POST",
          action: "/removeShoppingListItem",
          encType: "application/json",
        }
      );
    }
  };

  const addItemToInventory = (item: ShoppingListType) => {
    setSelectedItem(item);
    if (item) {
      fetcher.submit(
        { formData: item },
        {
          method: "POST",
          action: "/addShoppingListItemToInventory",
          encType: "application/json",
        }
      );
    }
  };

  const editItem = (item: ShoppingListType) => {
    console.log(item);
    setSelectedItem(null);
    if (item) {
      fetcher.submit(
        { formData: item },
        {
          method: "POST",
          action: "/editShoppingList",
          encType: "application/json",
        }
      );
    }
  };

  useEffect(() => {}, [fetcher.data]);
  return (
    <div>
      <h1 className="text-4xl font-semibold text-center m-4">Shopping List</h1>
      <div className="w-full flex justify-center">
        <form method="POST" action="/shoppingList" className="w-2/3">
          <p className="text-center text-xl font-medium">Add Item</p>
          <div className="lg:flex justify-center">
            <input
              id="item"
              name="item"
              placeholder="Item"
              className="p-4 border-2 rounded-md border-violet-300 lg:mx-2 w-full lg:w-2/3 mt-2"
            />
            <input
              id="amount"
              name="amount"
              placeholder="Amount (optional)"
              className="p-4 border-2 rounded-md border-violet-300 w-full lg:w-1/3 lg:mr-2 mt-2"
            />
            <input
              id="store"
              name="store"
              placeholder="Store (optional)"
              className="p-4 border-2 rounded-md border-violet-300 w-full lg:w-1/3 mt-2"
            />
            <button
              type="submit"
              className="p-2 text-lg font-medium border-emerald-300 rounded-md border-2 mx-2 mt-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center">
        {shoppingList.length > 0 && (
          <div className="lg:border-2 border-orange-300 rounded-md w-full lg:w-2/3 m-4 p-4">
            <div className="hidden lg:flex justify-between text-lg underline">
              <p>Item</p>
              <p>Amount</p>
              <p>Store</p>
              <p>Actions</p>
            </div>
            {shoppingList.map((item, index) => {
              const itemInInventory = inventory.find(
                (inventoryItem) =>
                  inventoryItem.item.toLowerCase() === item.item.toLowerCase()
              );
              const itemSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={index}
                  className="flex justify-between border-b-2 p-2 group hover:bg-fuchsia-100"
                >
                  {!itemSelected ? (
                    <div className="flex space-x-8 lg:space-x-16">
                      <p>{item.item}</p>
                      <p className="">{item.amount ?? ""}</p>
                      <p className="hidden">{item.store ?? ""}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <input
                        className="p-2 border-2 border-orange-300 rounded-md"
                        defaultValue={item.item}
                      />
                      <input
                        className="p-2 border-2 border-orange-300 rounded-md"
                        defaultValue={item.amount ?? ""}
                        placeholder="Add amount (optional)"
                      />
                      <input
                        className="p-2 border-2 border-orange-300 rounded-md"
                        defaultValue={item.store ?? ""}
                        placeholder="Add store (optional)"
                      />
                      <button onClick={() => editItem(item)}>Save</button>
                    </div>
                  )}

                  <div className="invisible group-hover:visible lg:visible">
                    {!itemInInventory && (
                      <button
                        title="Add Item to Inventory"
                        className="mr-2 px-2 rounded-md hover:bg-fuchsia-400 font-medium"
                        onClick={() => addItemToInventory(item)}
                      >
                        +
                      </button>
                    )}
                    <button
                      title="Delete Item from List"
                      className="px-2 rounded-md hover:bg-fuchsia-400 font-medium"
                      onClick={() => removeItem(item)}
                    >
                      -
                    </button>
                    <button
                      className="text-sm px-2 hover:bg-fuchsia-400 rounded-md"
                      onClick={() => {
                        if (!itemSelected) setSelectedItem(item);
                        else setSelectedItem(null);
                      }}
                    >
                      {!itemSelected ? "edit" : "stop edit"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
