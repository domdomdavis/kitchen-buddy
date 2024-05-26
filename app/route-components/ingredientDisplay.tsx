import { Dispatch, SetStateAction } from "react";
import { IngredientType } from "~/helpers/types";

export type IngredientDisplayProps = {
  ingredients: Array<IngredientType>;
  setIngredients?: Dispatch<SetStateAction<IngredientType[]>>;
};
export const IngredientDisplay = ({
  ingredients,
  setIngredients,
}: IngredientDisplayProps) => {
  return ingredients
    .sort((a, b) => a.id - b.id)
    .map((ingredient, index) => {
      return (
        <div key={index}>
          <span className="font-semibold">{ingredient.amount} </span>
          <span>{ingredient.ingredient}</span>
          {setIngredients && (
            <button
              className="mx-8 text-sm"
              onClick={() => {
                ingredients.splice(index, 1);
                setIngredients([...ingredients]);
              }}
            >
              remove
            </button>
          )}
        </div>
      );
    });
};
