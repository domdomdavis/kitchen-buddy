import { useFetcher } from "@remix-run/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType } from "~/helpers/types";

type EditWithComponentsProps = {
  ingredients: IngredientType[];
  setIngredients: Dispatch<SetStateAction<IngredientType[]>>;
  saveEditIngredient: (ingredient: IngredientType) => void;
  deleteIngredient: (ingredientId: number) => void;
};
export const EditWithComponents = ({
  ingredients,
  setIngredients,
  saveEditIngredient,
  deleteIngredient,
}: EditWithComponentsProps) => {
  const [ingredientList, setIngredientList] = useState(
    matchIngredientsToComponents(ingredients)
  );
  const fetcher = useFetcher();

  useEffect(() => {
    setIngredientList(matchIngredientsToComponents(ingredients));
  }, [fetcher.data]);

  const assignNewComponentToIngredients = (
    newComponent: string,
    oldComponent: string
  ) => {
    const data = {
      oldComponent,
      newComponent,
      recipe_id: ingredients[0].recipe_id ?? "",
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
      if (updated) {
        ingredients.splice(ingredientIndex, 1, updated);
        saveEditIngredient(updated);
      } else ingredients.splice(ingredientIndex, 1);
    }
    setIngredients([...ingredients]);
  };
  return ingredientList.map((component, index) => {
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
          let value = {
            ...ingredient,
            component: componentValue,
          };
          return (
            <div key={index} className="pl-4 w-full">
              <span className="mx-2 text-sm text-cyan-500">✦</span>

              {/* <span className="">
                <input
                  defaultValue={value.amount}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/4"
                  onBlur={(e) => {
                    const updated = {
                      ...value,
                      amount: e.target.value,
                    };
                    component.ingredientsForComponent.splice(index, 1, updated);
                    updateIngredientsArray(ingredient, updated);
                  }}
                />
              </span> */}
              <span className="w-full">
                <input
                  defaultValue={value.ingredient}
                  className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/2"
                  onBlur={(e) => {
                    const updatedIngredient = {
                      ...value,
                      ingredient: e.target.value,
                    };
                    component.ingredientsForComponent.splice(
                      index,
                      1,
                      updatedIngredient
                    );
                    updateIngredientsArray(ingredient, updatedIngredient);
                  }}
                />
              </span>
              <button
                className="mx-8 text-sm"
                onClick={() => {
                  component.ingredientsForComponent.splice(index, 1);
                  updateIngredientsArray(ingredient);
                  if (ingredient.id) deleteIngredient(ingredient.id);
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
