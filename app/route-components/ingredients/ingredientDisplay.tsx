import { Dispatch, SetStateAction } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType, InventoryType } from "~/helpers/types";

export type IngredientDisplayProps = {
  ingredients: Array<IngredientType>;
  setIngredients?: Dispatch<SetStateAction<IngredientType[]>>;
  recipeHasComponents?: boolean;
  inventory?: InventoryType[];
};
export const IngredientDisplay = ({
  ingredients,
  setIngredients,
  recipeHasComponents,
  inventory,
}: IngredientDisplayProps) => {
  const findIngredientInInventory = (ingredient: IngredientType) => {
    if (inventory && inventory.length > 0) {
      const found = inventory?.find(
        (item) =>
          ingredient.ingredient
            .toLowerCase()
            .includes(item.item.toLowerCase()) ?? null
      );
      if (found)
        return <span className="text-green-500 ml-2 font-bold">✓</span>;
      else return <span className="text-red-500 ml-2">x</span>;
    }
  };
  if (!recipeHasComponents) {
    return ingredients
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .map((ingredient, index) => {
        return (
          <div key={index} className="text-lg">
            <span className="mx-2 text-sm text-cyan-500">✦</span>
            <span className="font-medium">{ingredient.amount} </span>
            <span>{ingredient.ingredient}</span>
            {findIngredientInInventory(ingredient)}
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
        {component.component !== "" && (
          <div>
            <span className="mx-2 text-sm text-fuchsia-500">✦</span>

            <span className="text-xl font-medium mb-2">
              {component.component}
            </span>
          </div>
        )}
        {component.ingredientsForComponent.map((ingredient, index) => {
          return (
            <div className="mx-4 text-lg m-2" key={index}>
              <span className="mx-2 text-sm text-cyan-500">✦</span>
              <span className="font-medium">{ingredient.amount} </span>
              <span>{ingredient.ingredient}</span>
              {findIngredientInInventory(ingredient)}
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
        })}
      </div>
    ));
  }
};
