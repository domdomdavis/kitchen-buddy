import { Dispatch, SetStateAction } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType } from "~/helpers/types";

export type IngredientDisplayProps = {
  ingredients: Array<IngredientType>;
  setIngredients?: Dispatch<SetStateAction<IngredientType[]>>;
  recipeHasComponents?: boolean;
};
export const IngredientDisplay = ({
  ingredients,
  setIngredients,
  recipeHasComponents,
}: IngredientDisplayProps) => {
  if (!recipeHasComponents) {
    return ingredients
      .sort((a, b) => a.id - b.id)
      .map((ingredient, index) => {
        return (
          <div key={index} className="text-lg">
            <span className="font-semibold">{ingredient.amount} </span>
            <span>{ingredient.ingredient}</span>
            {setIngredients && (
              <button
                className="mx-8 text-sm"
                onClick={() => {
                  ingredients.splice(index, 1);
                  setIngredients([...ingredients]);
                }}
              >
                remove
              </button>
            )}
          </div>
        );
      });
  } else {
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
  }
};
