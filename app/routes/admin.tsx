import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { db } from "~/utils/db.server";
export const action = async ({ request }: ActionFunctionArgs) => {
  const prisma = new PrismaClient();
  const form = await request.formData();
  const perishable = form.get("perishable")?.toString();
  const productId = form.get("productId")?.toString();
  const newItem = form.get("newItem")?.toString();
  const perishableNew = form.get("perishableNew")?.toString();
  const deleteItem = form.get("delete")?.toString();
  if (productId) {
    const updated = await prisma.foodItem.update({
      where: {
        id: productId,
      },
      data: {
        perishable: Boolean(perishable),
      },
    });
    return updated;
  } else if (newItem) {
    const newFoodItem = await prisma.foodItem.create({
      data: {
        product: newItem,
        perishable: Boolean(perishableNew),
      },
    });
    return newFoodItem;
  } else if (deleteItem) {
    return await prisma.foodItem.delete({
      where: {
        id: deleteItem,
      },
    });
  }
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const foodItems = await db.foodItem.findMany();
  return { foodItems };
};
type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Admin() {
  const { foodItems } = useLoaderData<LoaderType>();
  return (
    <div>
      <h1 className="text-center text-3xl font-medium mt-2">Admin</h1>
      <div className="flex w-full justify-center">
        <Form method="POST" action="/admin">
          <label>Add item:</label>
          <input
            id="newItem"
            name="newItem"
            className="p-2 border-2 rounded-md border-violet-300 mx-2"
          />
          <label className="mr-2">Perishable:</label>
          <input type="checkbox" id="perishableNew" name="perishableNew" />
          <button
            type="submit"
            className="mx-4 border-2 p-2 rounded-md font-medium border-emerald-300"
          >
            submit
          </button>
        </Form>
      </div>
      <div className="mx-8">
        {" "}
        {foodItems
          .sort((a, b) => a.product.localeCompare(b.product))
          .map((item, index) => {
            const [checked, setChecked] = useState(item.perishable ?? false);
            const showSaveButton = checked !== Boolean(item.perishable);
            return (
              <div key={index} className="my-2 flex">
                <p className="text-lg font-medium mr-4">{item.product}</p>
                <Form method="POST" action="/admin">
                  <label htmlFor="perishable" className="mr-2">
                    perishable:
                  </label>
                  <input
                    id="perishable"
                    type="checkbox"
                    name="perishable"
                    value={checked.toString()}
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  {showSaveButton && (
                    <button
                      type="submit"
                      id="productId"
                      name="productId"
                      className="font-semibold mx-8"
                      value={item.id}
                    >
                      save
                    </button>
                  )}
                  <button
                    className="mx-8"
                    id="delete"
                    name="delete"
                    value={item.id}
                  >
                    delete
                  </button>
                </Form>
              </div>
            );
          })}
      </div>
    </div>
  );
}
