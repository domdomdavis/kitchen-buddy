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
          action: "/ingredient/editRecipeComponent",
          encType: "application/json",
        }
      );
    }
  };

  const ingredientList = matchIngredientsToComponents(ingredients);
  return ingredientList.map((component, index) => {
    const [componentValue, setComponentValue] = useState(component.component);
    return (
      <div key={index} className="w-full">
        <span className="mr-4 text-sm text-fuchsia-500">✦</span>

        <input
          value={componentValue}
          className="border-2 p-2 border-blue-400 rounded-md my-2 text-lg"
          onChange={(e) => setComponentValue(e.target.value)}
          onBlur={() =>
            assignNewComponentToIngredients(componentValue, component.component)
          }
        />
        {component.ingredientsForComponent.map((ingredient, index) => {
          const [amountValue, setAmountValue] = useState(ingredient.amount);
          const [ingredientName, setIngredientName] = useState(
            ingredient.ingredient
          );
          const updatedIngredient = {
            id: ingredient.id,
            amount: amountValue,
            ingredient: ingredientName,
          };
          return (
            <div key={index} className="pl-4 w-full">
              <span className="mx-2 text-sm text-emerald-500">✦</span>

              <span className="">
                <input
                  value={amountValue}
                  className="border-2 p-2 border-blue-400 rounded-md m-2"
                  onChange={(e) => setAmountValue(e.target.value)}
                />
              </span>
              <span className="w-full">
                <input
                  value={ingredientName}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/2"
                  onChange={(e) => setIngredientName(e.target.value)}
                  onBlur={() => {
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
