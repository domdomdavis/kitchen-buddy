import { IngredientDisplayProps, IngredientType } from "~/helpers/types";

export const IngredientWithComponentDisplay = ({
  ingredients,
}: IngredientDisplayProps) => {
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

  return ingredientList.map((component, index) => (
    <div key={index} className="mb-4">
      <p className="text-xl font-medium mb-2">{component.component}</p>
      {component.ingredientsForComponent.map((ingredient, index) => {
        return (
          <div className="mx-4 text-lg" key={index}>
            <span>• </span>
            <span className="font-semibold">{ingredient.amount} </span>
            <span>{ingredient.ingredient}</span>
          </div>
        );
      })}
    </div>
  ));
};
