import { useFetcher } from "@remix-run/react";
import { useState } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType } from "~/helpers/types";

type EditWithComponentsProps = {
  ingredients: IngredientType[];
  saveEditIngredient: (ingredient: IngredientType) => void;
  deleteIngredient: (ingredientId?: number) => void;
};
export const EditWithComponents = ({
  ingredients,
  saveEditIngredient,
  deleteIngredient,
}: EditWithComponentsProps) => {
  const fetcher = useFetcher();
  const assignNewComponentToIngredients = (
    newComponent: string,
    oldComponent: string
  ) => {
    const data = {
      oldComponent,
      newComponent,
    };
    if (oldComponent !== newComponent) {
      fetcher.submit(
        {
          formData: data,
        },
        {
          method: "POST",
          action: "/editRecipeComponent",
          encType: "application/json",
        }
      );
    }
  };

  const ingredientList = matchIngredientsToComponents(ingredients);
  return ingredientList.map((component, index) => {
    let componentValue = component.component;
    return (
      <div key={index} className="w-full">
        <span className="mr-4 text-sm text-fuchsia-500">✦</span>

        <input
          defaultValue={componentValue}
          className="border-2 p-2 border-blue-400 rounded-md my-2 text-lg"
          onBlur={(e) => {
            componentValue = e.target.value;
            assignNewComponentToIngredients(
              componentValue,
              component.component
            );
          }}
        />
        {component.ingredientsForComponent.map((ingredient, index) => {
          let amountValue = ingredient.amount;
          let ingredientName = ingredient.ingredient;

          return (
            <div key={index} className="pl-4 w-full">
              <span className="mx-2 text-sm text-emerald-500">✦</span>

              <span className="">
                <input
                  defaultValue={amountValue}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/4"
                  onBlur={(e) => (amountValue = e.target.value)}
                />
              </span>
              <span className="w-full">
                <input
                  defaultValue={ingredientName}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/2"
                  onBlur={(e) => {
                    ingredientName = e.target.value;
                    const updatedIngredient = {
                      id: ingredient.id,
                      amount: amountValue,
                      ingredient: ingredientName,
                    };
                    saveEditIngredient(updatedIngredient);
                  }}
                />
              </span>
              <button
                className="mx-8 text-sm"
                onClick={() => {
                  deleteIngredient(ingredient.id);
                }}
              >
                remove
              </button>
            </div>
          );
        })}
      </div>
    );
  });
};
