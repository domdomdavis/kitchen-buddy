import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType } from "~/helpers/types";

type EditModeIngredientsProps = {
  ingredients: IngredientType[];
  recipeHasComponents: boolean;
};

export const EditModeIngredients = ({
  ingredients,
  recipeHasComponents,
}: EditModeIngredientsProps) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const saveEditIngredient = (updatedIngredient: IngredientType) => {
    fetcher.submit(
      {
        formData: updatedIngredient,
      },
      { method: "POST", action: "/editIngredient", encType: "application/json" }
    );
  };
  useEffect(() => {
    if (fetcher.data) {
      console.log(fetcher.data);
    }
  }, [fetcher.data]);
  if (!recipeHasComponents) {
    return ingredients
      .sort((a, b) => a.id - b.id)
      .map((ingredient, index) => {
        const [amountValue, setAmountValue] = useState(ingredient.amount);
        const [ingredientName, setIngredientName] = useState(
          ingredient.ingredient
        );
        const updatedIngredient = {
          id: ingredient.id,
          amount: amountValue,
          ingredient: ingredientName,
        };
        return (
          <div key={index}>
            <span>
              <input
                value={amountValue}
                className="border-2 p-2 border-violet-300 rounded-md m-2"
                onChange={(e) => setAmountValue(e.target.value)}
              />
            </span>
            <span>
              <input
                value={ingredientName}
                className="border-2 p-2 border-violet-300 rounded-md m-2 w-1/2"
                onChange={(e) => setIngredientName(e.target.value)}
                onBlur={() => saveEditIngredient(updatedIngredient)}
              />
            </span>
          </div>
        );
      });
  } else {
    const assignNewComponentToIngredients = (
      newComponent: string,
      oldComponent: string
    ) => {
      const data = {
        oldComponent,
        newComponent,
      };
      if (oldComponent !== newComponent) {
        fetcher.submit(
          {
            formData: data,
          },
          {
            method: "POST",
            action: "/editRecipeComponent",
            encType: "application/json",
          }
        );
      }
    };

    const ingredientList = matchIngredientsToComponents(ingredients);
    return ingredientList.map((component, index) => {
      const [componentValue, setComponentValue] = useState(component.component);
      return (
        <div key={index}>
          <input
            value={componentValue}
            className="border-2 p-2 border-violet-300 rounded-md m-2 w-1/3 text-lg"
            onChange={(e) => setComponentValue(e.target.value)}
            onBlur={() =>
              assignNewComponentToIngredients(
                componentValue,
                component.component
              )
            }
          />
          {component.ingredientsForComponent.map((ingredient, index) => {
            const [amountValue, setAmountValue] = useState(ingredient.amount);
            const [ingredientName, setIngredientName] = useState(
              ingredient.ingredient
            );
            const updatedIngredient = {
              id: ingredient.id,
              amount: amountValue,
              ingredient: ingredientName,
            };
            return (
              <div key={index}>
                <span>
                  <input
                    value={amountValue}
                    className="border-2 p-2 border-violet-300 rounded-md m-2"
                    onChange={(e) => setAmountValue(e.target.value)}
                  />
                </span>
                <span>
                  <input
                    value={ingredientName}
                    className="border-2 p-2 border-violet-300 rounded-md m-2 w-1/2"
                    onChange={(e) => setIngredientName(e.target.value)}
                    onBlur={() => saveEditIngredient(updatedIngredient)}
                  />
                </span>
              </div>
            );
          })}
        </div>
      );
    });
  }
};
