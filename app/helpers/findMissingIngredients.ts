import pluralize from "pluralize";
import { FoodItemType, IngredientType, InventoryType } from "./types";
import { matchIngredientsToFoodItems } from "./matchIngredientsToFoodItems";

type FindMissingIngredientsProps = {
  ingredients: IngredientType[];
  inventory: InventoryType[];
  foodItems: FoodItemType[];
};
export const findMissingIngredients = ({
  ingredients,
  inventory,
  foodItems,
}: FindMissingIngredientsProps) => {
  const missingIngredients: string[] = [];
  const ingredientItems = matchIngredientsToFoodItems({
    ingredients,
    foodItems,
  });
  ingredientItems.map((foodItem) => {
    const ingredient = foodItem.product;
    const iceOrWater =
      ingredient.toLowerCase() === "ice" ||
      ingredient.toLowerCase() === "water";
    const strippedIngredient = ingredient
      .toLowerCase()
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
        missingIngredients.push(ingredient);
    }
  });
  const missingWithoutDupes = new Set(missingIngredients);
  return [...missingWithoutDupes];
};
