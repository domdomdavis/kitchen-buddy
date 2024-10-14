import { useFetcher } from "@remix-run/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IngredientType } from "~/helpers/types";
import { EditWithoutComponents } from "./editWithoutComponents";
import { EditWithComponents } from "./editWithComponents";
import { LoadingSpinner } from "~/common-components/loadingSpinner";

type EditModeIngredientsProps = {
  ingredients: IngredientType[];
  recipeHasComponents?: boolean;
  setIngredients: Dispatch<SetStateAction<IngredientType[]>>;
};

export const EditModeIngredients = ({
  ingredients,
  setIngredients,
  recipeHasComponents,
}: EditModeIngredientsProps) => {
  const fetcher = useFetcher();
  const saveEditIngredient = (updatedIngredient: IngredientType) => {
    fetcher.submit(
      {
        formData: updatedIngredient,
      },
      {
        method: "POST",
        action: "/editIngredient",
        encType: "application/json",
      }
    );
  };

  const deleteIngredient = (ingredientId: number) => {
    fetcher.submit(
      { formData: { id: ingredientId } },
      {
        method: "POST",
        action: "/deleteIngredient",
        encType: "application/json",
      }
    );
  };

  if (!recipeHasComponents) {
    return (
      <div>
        {fetcher.state !== "idle" ? (
          <LoadingSpinner />
        ) : (
          <EditWithoutComponents
            ingredients={ingredients}
            setIngredients={setIngredients}
            saveEditIngredient={saveEditIngredient}
            deleteIngredient={deleteIngredient}
          />
        )}
      </div>
    );
  } else {
    return (
      <div>
        {fetcher.state !== "idle" ? (
          <LoadingSpinner />
        ) : (
          <EditWithComponents
            ingredients={ingredients}
            setIngredients={setIngredients}
            saveEditIngredient={saveEditIngredient}
            deleteIngredient={deleteIngredient}
          />
        )}
      </div>
    );
  }
};
