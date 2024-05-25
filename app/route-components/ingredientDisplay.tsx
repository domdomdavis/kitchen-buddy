import { IngredientDisplayProps } from "~/helpers/types";

export const IngredientDisplay = ({ ingredients }: IngredientDisplayProps) => {
  return ingredients.map((ingredient) => {
    return (
      <div>
        <span className="font-semibold">{ingredient.amount} </span>
        <span>{ingredient.ingredient}</span>
      </div>
    );
  });
};
