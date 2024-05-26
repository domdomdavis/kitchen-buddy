import { useEffect, useState } from "react";
import { RecipeType } from "~/helpers/types";
import { EditModeIngredients } from "./editModeIngredients";
import { useFetcher, useNavigate } from "@remix-run/react";

type EditModeRecipeProps = {
  recipe: RecipeType;
  recipeHasComponents: boolean;
};

export const EditModeRecipe = ({
  recipe,
  recipeHasComponents,
}: EditModeRecipeProps) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [recipeTitle, setRecipeTitle] = useState(recipe.title);
  const [photoUrl, setPhotoUrl] = useState(recipe.photo_url);
  const instructions = recipe.instructions;
  const ingredients = recipe.ingredients;

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
      const fetcherData = fetcher.data as RecipeType;
      console.log(fetcherData);
      navigate(0);
    }
  }, [fetcher.data]);
  return (
    <div className="flex">
      <div className="p-8 flex flex-col w-1/3">
        <input
          className="border-2 p-4 border-violet-300 rounded-md w-full text-2xl"
          value={recipeTitle}
          onChange={(e) => setRecipeTitle(e.target.value)}
        />
        <input
          className="border-2 p-4 border-violet-300 rounded-md w-full mt-2"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
        <div className="mt-8 w-full">
          <p className="text-2xl m-2">Instructions</p>
          {recipe.instructions.map((instruction, index) => {
            const [instructionValue, setInstructionValue] =
              useState(instruction);
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
          })}
        </div>
      </div>
      <div className="p-8 w-1/3">
        <p className="text-2xl m-2">Ingredients</p>
        <EditModeIngredients
          ingredients={ingredients}
          recipeHasComponents={recipeHasComponents}
        />
        <button
          onClick={saveEditRecipe}
          className="mt-2 p-4 mx-16 bg-sky-400 rounded-md font-semibold text-lg h-16"
        >
          Save Recipe
        </button>
      </div>

      <div className="h-108 w-96">
        <img src={photoUrl} className="object-scale-down rounded-md" />
      </div>
    </div>
  );
};
