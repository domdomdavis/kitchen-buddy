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
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/common-components/button";
import { LoadingSpinner } from "~/common-components/loadingSpinner";
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
  if (!user) throw redirect("/login");
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
  const [addingQuantity, setAddingQuantity] = useState(false);
  const [addingStore, setAddingStore] = useState(false);
  const [updatedValues, setUpdatedValues] = useState({
    amount: "",
    store: "",
  });
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const actionData = useActionData();
  let $form = useRef<HTMLFormElement>(null);

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

  const saveEditItem = (item: ShoppingListType) => {
    const formData = {
      ...item,
      amount:
        updatedValues.amount !== ""
          ? updatedValues.amount
          : item.amount ?? null,
      store:
        updatedValues.store !== "" ? updatedValues.store : item.store ?? null,
    };
    fetcher.submit(
      { formData },
      {
        method: "POST",
        action: "/editShoppingList",
        encType: "application/json",
      }
    );
  };

  if (navigation.state === "idle" && actionData && $form.current)
    $form.current.reset();

  useEffect(() => {
    setAddingQuantity(false);
    setAddingStore(false);
    setUpdatedValues({ amount: "", store: "" });
  }, [fetcher.data]);
  return (
    <div>
      <h1 className="text-4xl font-semibold text-center m-4">Shopping List</h1>
      <div className="w-full flex justify-center">
        <Form
          method="POST"
          action="/shoppingList"
          className="w-2/3"
          ref={$form}
        >
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
              className="p-2 text-lg font-medium border-sky-300 rounded-md border-2 mx-2 mt-2"
            >
              Submit
            </button>
          </div>
          {navigation.state !== "idle" && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
        </Form>
      </div>
      <div className="flex justify-center">
        {shoppingList.length > 0 && (
          <div className="lg:border-2 border-orange-300 rounded-md w-full lg:w-2/3 m-4 p-4">
            {shoppingList
              .sort((a, b) => a.item.localeCompare(b.item))
              .map((item, index) => {
                const itemInInventory = inventory.find(
                  (inventoryItem) =>
                    inventoryItem.item.toLowerCase() === item.item.toLowerCase()
                );
                const itemSelected = selectedItem?.id === item.id;
                return (
                  <div className="border-b-2 p-2" key={index}>
                    <div className="flex justify-between">
                      <p
                        className={`text-lg ${
                          itemSelected && "font-semibold"
                        } w-full`}
                        onClick={() => setSelectedItem(item)}
                      >
                        {item.item.toLowerCase()}
                      </p>
                      {itemSelected && (
                        <button
                          className="font-semibold"
                          onClick={() => setSelectedItem(null)}
                        >
                          -
                        </button>
                      )}
                    </div>
                    {itemSelected && (
                      <div>
                        {fetcher.state !== "idle" && <LoadingSpinner />}
                        {item?.amount && item.amount !== "" && (
                          <p className="">Quantity: {item.amount}</p>
                        )}
                        {item?.store && item.store !== "" && (
                          <p>Store: {item.store}</p>
                        )}
                        <div className="flex flex-col items-end space-y-2">
                          {!itemInInventory && (
                            <Button
                              onClick={() => addItemToInventory(item)}
                              text="Add to Inventory"
                            />
                          )}
                          <Button
                            onClick={() => removeItem(item)}
                            text="Remove from Shopping List"
                          />
                          <Button
                            onClick={() => setAddingQuantity(!addingQuantity)}
                            text={
                              !addingQuantity
                                ? `${
                                    !item.amount
                                      ? "Add Quantity"
                                      : "Edit Quantity"
                                  }`
                                : "Cancel Add Quantity"
                            }
                          />
                          <Button
                            onClick={() => setAddingStore(!addingStore)}
                            text={
                              !addingStore
                                ? `${!item.store ? "Add Store" : "Edit Store"}`
                                : "Cancel Add Store"
                            }
                          />
                        </div>
                        {addingQuantity && (
                          <input
                            id="editQuantity"
                            name="editQuantity"
                            className="p-2 border-2 border-orange-300 rounded-md w-3/4 my-2"
                            defaultValue={item.amount ?? ""}
                            placeholder="Add quantity"
                            onChange={(e) =>
                              setUpdatedValues({
                                ...updatedValues,
                                amount: e.target.value,
                              })
                            }
                          />
                        )}
                        {addingStore && (
                          <input
                            id="editStore"
                            name="editStore"
                            className="p-2 border-2 border-orange-300 rounded-md w-3/4 my-2"
                            defaultValue={item.store ?? ""}
                            placeholder="Add store"
                            onChange={(e) =>
                              setUpdatedValues({
                                ...updatedValues,
                                store: e.target.value,
                              })
                            }
                          />
                        )}
                        {(addingQuantity || addingStore) && (
                          <button
                            onClick={() => saveEditItem(item)}
                            className="m-2 border-2 p-2 border-sky-300 rounded-md font-medium"
                          >
                            submit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
