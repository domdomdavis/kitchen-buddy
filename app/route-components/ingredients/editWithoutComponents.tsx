import { Dispatch, SetStateAction, useState } from "react";
import { IngredientType } from "~/helpers/types";

type EditWithoutComponentsProps = {
  ingredients: IngredientType[];
  setIngredients: Dispatch<SetStateAction<IngredientType[]>>;
  saveEditIngredient: (ingredient: IngredientType) => void;
  deleteIngredient: (ingredientId: number) => void;
};
export const EditWithoutComponents = ({
  ingredients,
  setIngredients,
  saveEditIngredient,
  deleteIngredient,
}: EditWithoutComponentsProps) => {
  return ingredients
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    .map((ingredient, index) => {
      let ingredientName = ingredient.ingredient;

      return (
        <div key={index} className="w-full flex">
          <span className="mx-2 mt-6 text-sm text-cyan-500">✦</span>
          <span className="w-2/3 m-2">
            <input
              value={ingredientName}
              className="border-2 p-2 border-blue-400 rounded-md w-full"
              onChange={(e) => {
                ingredientName = e.target.value;
                const updated = {
                  ...ingredient,
                  ingredient: ingredientName,
                };
                ingredients.splice(index, 1, updated);
                setIngredients([...ingredients]);
              }}
              onBlur={() => {
                const updatedIngredient = {
                  id: ingredient.id,
                  ingredient: ingredientName,
                };
                saveEditIngredient(updatedIngredient);
              }}
            />
          </span>

          <span>
            <button
              className="mx-8 mt-4 text-sm"
              onClick={() => {
                ingredients.splice(index, 1);
                setIngredients([...ingredients]);
                if (ingredient.id) deleteIngredient(ingredient.id);
              }}
            >
              remove
            </button>
          </span>
        </div>
      );
    });
};
