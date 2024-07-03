import { FoodItemType, IngredientType, RecipeType } from "./types";

type CheckIngredientProps = {
  ingredient: IngredientType;
  allRecipes: RecipeType[];
  foodItems: FoodItemType[];
};
export const checkIngredient = ({
  ingredient,
  allRecipes,
  foodItems,
}: CheckIngredientProps) => {
  const matchingRecipe = allRecipes?.find((recipe) =>
    ingredient.ingredient.toLowerCase().includes(recipe.title.toLowerCase())
  );
  if (matchingRecipe) {
    return (
      <Link to={`/recipes/${matchingRecipe.id}`} className="underline">
        {ingredient.ingredient}
      </Link>
    );
  } else {
    let ingredientString = ingredient.ingredient;
    const matchingFoodItem = foodItems
      ?.filter((item) =>
        ingredient.ingredient.toLowerCase().includes(item.toLowerCase())
      )
      .sort((a, b) => b.length - a.length)[0];
    if (matchingFoodItem) {
      let ingredientRegExp = new RegExp(matchingFoodItem ?? "", "g");
      ingredientString = ingredientString.replace(
        ingredientRegExp,
        `<span className="font-medium">${matchingFoodItem}</span>`
      );
    }
    return <span>{parse(ingredientString)}</span>;
  }
};
