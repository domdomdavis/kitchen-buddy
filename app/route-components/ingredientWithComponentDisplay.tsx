import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientDisplayProps, IngredientType } from "~/helpers/types";

export const IngredientWithComponentDisplay = ({
  ingredients,
}: IngredientDisplayProps) => {
  const ingredientList = matchIngredientsToComponents(ingredients);
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
