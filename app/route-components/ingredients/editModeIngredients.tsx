import { useFetcher, useNavigate } from "@remix-run/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import matchIngredientsToComponents from "~/helpers/matchIngredientToComponent";
import { IngredientType } from "~/helpers/types";
import { EditWithoutComponents } from "./editWithoutComponents";
import { EditWithComponents } from "./editWithComponents";

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
  const deleteIngredient = (ingredientId?: number) => {
    fetcher.submit(
      { formData: { id: ingredientId ?? null } },
      {
        method: "POST",
        action: "/deleteIngredient",
        encType: "application/json",
      }
    );
  };

  if (!recipeHasComponents) {
    return (
      <EditWithoutComponents
        ingredients={ingredients}
        setIngredients={setIngredients}
        saveEditIngredient={saveEditIngredient}
        deleteIngredient={deleteIngredient}
      />
    );
  } else {
    return (
      <EditWithComponents
        ingredients={ingredients}
        saveEditIngredient={saveEditIngredient}
        deleteIngredient={deleteIngredient}
      />
    );
  }
};
