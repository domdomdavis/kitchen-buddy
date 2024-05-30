import { useFetcher } from "@remix-run/react";
import { Dispatch, SetStateAction, useState } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType } from "~/helpers/types";

type EditWithComponentsProps = {
  ingredients: IngredientType[];
  setIngredients: Dispatch<SetStateAction<IngredientType[]>>;
  saveEditIngredient: (ingredient: IngredientType) => void;
  deleteIngredient: (ingredientId?: number) => void;
};
export const EditWithComponents = ({
  ingredients,
  setIngredients,
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
  const updateIngredientsArray = (
    ingredient: IngredientType,
    updated?: IngredientType
  ) => {
    const matchingIngredient = ingredients.find(
      (item) => item.id === ingredient.id
    );
    const ingredientIndex = matchingIngredient
      ? ingredients.indexOf(matchingIngredient)
      : null;
    if (ingredientIndex) {
      if (updated) ingredients.splice(ingredientIndex, 1, updated);
      else ingredients.splice(ingredientIndex, 1);
    }
    setIngredients([...ingredients]);
  };
  const ingredientList = matchIngredientsToComponents(ingredients);
  const [fields] = useState(ingredientList);
  return fields.map((component, index) => {
    let componentValue = component.component;
    return (
      <div key={index} className="w-full">
        {component.component !== "" && (
          <div>
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
          </div>
        )}
        {component.ingredientsForComponent.map((ingredient, index) => {
          let amountValue = ingredient.amount;
          let ingredientName = ingredient.ingredient;

          return (
            <div key={index} className="pl-4 w-full">
              <span className="mx-2 text-sm text-emerald-500">✦</span>

              <span className="">
                <input
                  value={amountValue}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/4"
                  onChange={(e) => {
                    amountValue = e.target.value;
                    const updated = {
                      ...ingredient,
                      amount: amountValue,
                      component: componentValue,
                    };
                    component.ingredientsForComponent.splice(index, 1, updated);
                    updateIngredientsArray(ingredient, updated);
                  }}
                />
              </span>
              <span className="w-full">
                <input
                  value={ingredientName}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/2"
                  onChange={(e) => {
                    ingredientName = e.target.value;
                    const updated = {
                      ...ingredient,
                      ingredient: ingredientName,
                      component: componentValue,
                    };
                    component.ingredientsForComponent.splice(index, 1, updated);
                    updateIngredientsArray(ingredient, updated);
                  }}
                  onBlur={() => {
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
                  component.ingredientsForComponent.splice(index, 1);
                  updateIngredientsArray(ingredient);
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
