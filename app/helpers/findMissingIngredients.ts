import { IngredientType, InventoryType } from "./types";

type FindMissingIngredientsProps = {
  ingredients: IngredientType[];
  inventory: InventoryType[];
};
export const findMissingIngredients = ({
  ingredients,
  inventory,
}: FindMissingIngredientsProps) => {
  const missingIngredients: IngredientType[] = [];

  ingredients.map((ingredient) => {
    const iceOrWater =
      ingredient.ingredient.toLowerCase() === "ice" ||
      ingredient.ingredient.toLowerCase().includes(" ice") ||
      ingredient.ingredient.toLowerCase().includes(" water");
    if (!iceOrWater) {
      if (
        !inventory.find((item) =>
          ingredient.ingredient.toLowerCase().includes(item.item.toLowerCase())
        )
      )
        missingIngredients.push(ingredient);
    }
  });
  return missingIngredients;
};
