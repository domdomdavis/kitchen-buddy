import pluralize from "pluralize";
import { FoodItemType, IngredientType, InventoryType } from "./types";
import { matchIngredientsToFoodItems } from "./matchIngredientsToFoodItems";

type FindMissingIngredientsProps = {
  ingredients: IngredientType[];
  inventory: InventoryType[];
  foodItems: FoodItemType[];
  excludeOptional?: boolean;
};
export const findMissingIngredients = ({
  ingredients,
  inventory,
  foodItems,
  excludeOptional,
}: FindMissingIngredientsProps) => {
  const missingIngredients: string[] = [];
  let ingredientItems = matchIngredientsToFoodItems({
    ingredients,
    foodItems,
  });
  if (excludeOptional)
    ingredientItems = ingredientItems.filter(
      (ingredient) => ingredient?.optional === false
    );
  ingredientItems.map((foodItem) => {
    const ingredient = foodItem?.item;
    const iceOrWater =
      ingredient?.toLowerCase() === "ice" ||
      ingredient?.toLowerCase() === "water";
    const strippedIngredient = ingredient
      ?.toLowerCase()
      .replace(/[\s~`*();:"',-]/g, "")
      .trim();
    if (!iceOrWater) {
      if (
        !inventory.find(
          (item) =>
            strippedIngredient ===
              item.item
                .toLowerCase()
                .replace(/[\s~`*();:"',-]/g, "")
                .trim() ||
            strippedIngredient ===
              pluralize.singular(
                item.item.toLowerCase().replace(/[\s~`*();:"',-]/g, "")
              )
        )
      )
        if (ingredient) missingIngredients.push(ingredient);
    }
  });
  const missingWithoutDupes = new Set(missingIngredients);
  return [...missingWithoutDupes];
};
