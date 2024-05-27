import { RecipeType } from "~/helpers/types";
import { IngredientWithComponentDisplay } from "./ingredientWithComponentDisplay";
import { IngredientDisplay } from "./ingredientDisplay";
import { useEffect, useState } from "react";
import { EditModeIngredients } from "./editModeIngredients";
import { useFetcher, useNavigate } from "@remix-run/react";

type RecipeProps = {
  recipe: RecipeType;
  recipeHasComponents?: boolean;
  editMode: boolean;
};

export const Recipe = ({
  recipe,
  recipeHasComponents,
  editMode,
}: RecipeProps) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [recipeTitle, setRecipeTitle] = useState(recipe.title);
  const [photoUrl, setPhotoUrl] = useState(recipe.photo_url);
  const ingredients = recipe.ingredients;
  const instructions = recipe.instructions;

  const saveEditRecipe = () => {
    const updatedRecipe = {
      id: recipe.id,
      title: recipeTitle,
      photo_url: photoUrl,
      instructions,
      ingredients,
    };
    fetcher.submit(
      {
        formData: updatedRecipe,
      },
      { method: "POST", action: "/editRecipe", encType: "application/json" }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      navigate(0);
    }
  }, [fetcher.data]);

  return (
    <div className="flex flex-col mx-8 w-full">
      {!editMode ? (
        <h1 className="text-4xl font-semibold text-center">{recipe?.title}</h1>
      ) : (
        <div className="place-self-center w-1/4">
          <input
            className="text-center font-semibold p-2 border-2 border-violet-300 rounded-md w-full text-4xl"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
        </div>
      )}
      <div className="flex justify-center w-full">
        <span className="h-108 w-96 p-8">
          <img
            src={recipe?.photo_url}
            className="object-scale-down rounded-md"
          />
          {editMode && (
            <input
              className="border-2 p-4 border-violet-300 w-full rounded-md mt-2"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          )}
        </span>
        <span className="p-8 w-1/3">
          <h2 className="text-2xl font-medium mb-2">Ingredients</h2>
          {!editMode ? (
            <IngredientDisplay
              ingredients={ingredients}
              recipeHasComponents={recipeHasComponents}
            />
          ) : (
            <div className="w-full">
              <EditModeIngredients
                ingredients={ingredients}
                recipeHasComponents={recipeHasComponents}
              />
            </div>
          )}
        </span>
      </div>
      {editMode && (
        <div className="w-1/6 h-5/6 place-self-end place-content-end fixed mr-48">
          <button
            onClick={saveEditRecipe}
            className="p-4 rounded-md font-semibold text-xl mt-4 mx-16"
          >
            Save Changes
          </button>
        </div>
      )}
      <div className="flex justify-center">
        <div className="p-8 flex-col flex-wrap w-1/2">
          <h3 className="text-2xl mb-4 font-medium">Instructions</h3>
          {instructions.map((step, index) => {
            const [instructionValue, setInstructionValue] = useState(step);
            if (!editMode) {
              return (
                <div className="mb-4" key={index}>
                  <span className="font-semibold text-xl">{index + 1}. </span>
                  <span className="text-lg">{step}</span>
                </div>
              );
            } else {
              return (
                <div className="m-2 flex w-full">
                  <span className="text-xl mr-4 mt-2">{index + 1}.</span>
                  <span className="w-full">
                    <textarea
                      value={instructionValue}
                      className="border-2 p-2 border-violet-300 rounded-md w-full mt-2"
                      rows={5}
                      onChange={(e) => setInstructionValue(e.target.value)}
                      onBlur={() =>
                        instructions.splice(index, 1, instructionValue)
                      }
                    />
                  </span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
