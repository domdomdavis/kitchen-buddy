import { IngredientDisplayProps, IngredientType } from "./types";

export default function matchIngredientsToComponents(
  ingredients: IngredientType[]
) {
  const ingredientList: Array<{
    component: string;
    ingredientsForComponent: Array<IngredientType>;
  }> = [];
  const sortIngredientsByComponent = (
    component: string,
    _: string,
    set: Set<string>
  ) => {
    const ingredientsForComponent: Array<IngredientType> = [];
    ingredients.map((ingredient) => {
      if (ingredient.component === component) {
        ingredientsForComponent.push(ingredient);
      }
    });
    ingredientList.push({
      component,
      ingredientsForComponent,
    });
  };
  const recipeComponents = new Set(
    ingredients.map((ingredient) => ingredient.component ?? "")
  );
  recipeComponents.forEach(sortIngredientsByComponent);
  return ingredientList;
}
