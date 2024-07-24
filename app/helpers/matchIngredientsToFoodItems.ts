import { FoodItemType, IngredientType } from "./types";

type MatchIngredientsToFoodItemsProps = {
  ingredients: IngredientType[];
  foodItems: FoodItemType[];
};
export const matchIngredientsToFoodItems = ({
  ingredients,
  foodItems,
}: MatchIngredientsToFoodItemsProps) => {
  const ingredientNamesUnique = new Set<string>(
    ingredients.map((ingredient: IngredientType) => ingredient.ingredient)
  );
  const ingredientArray = Array.from(ingredientNamesUnique);
  const matchingFoodItems = ingredientArray.map(
    (ingredient) =>
      foodItems
        .filter((item) =>
          ingredient
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(item.product.toLowerCase().replace(/\s+/g, ""))
        )
        .sort((a, b) => b.product.length - a.product.length)[0]
  );
  return matchingFoodItems;
};
