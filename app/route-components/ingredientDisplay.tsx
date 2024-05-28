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
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .map((ingredient, index) => {
        return (
          <div key={index} className="text-lg">
            <span className="mx-2 text-sm text-emerald-500">✦</span>
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
        <span className="mx-2 text-sm text-fuchsia-500">✦</span>

        <span className="text-xl font-medium mb-2">{component.component}</span>
        {component.ingredientsForComponent.map((ingredient, index) => {
          return (
            <div className="mx-4 text-lg m-2" key={index}>
              <span className="mx-2 text-sm text-emerald-500">✦</span>
              <span className="font-semibold">{ingredient.amount} </span>
              <span>{ingredient.ingredient}</span>
            </div>
          );
        })}
      </div>
    ));
  }
};
