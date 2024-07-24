import pluralize from "pluralize";
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
    const iceWaterOrOptional =
      ingredient.ingredient.toLowerCase() === "ice" ||
      ingredient.ingredient.toLowerCase().includes(" ice ") ||
      ingredient.ingredient.toLowerCase().includes(" water") ||
      ingredient.ingredient.toLowerCase().includes("optional");
    const strippedIngredient = ingredient.ingredient
      .toLowerCase()
      .replace(/[\s~`*();:"',-]/g, "");
    if (!iceWaterOrOptional) {
      if (
        !inventory.find(
          (item) =>
            strippedIngredient.includes(
              item.item.toLowerCase().replace(/[\s~`*();:"',-]/g, "")
            ) ||
            strippedIngredient.includes(
              pluralize.singular(
                item.item.toLowerCase().replace(/[\s~`*();:"',-]/g, "")
              )
            )
        )
      )
        missingIngredients.push(ingredient);
    }
  });
  return missingIngredients;
};
