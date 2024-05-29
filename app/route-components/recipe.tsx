import { RecipeType } from "~/helpers/types";
import { IngredientDisplay } from "./ingredients/ingredientDisplay";
import { useState } from "react";
import { EditModeIngredients } from "./ingredients/editModeIngredients";
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
  const [inputFieldValues, setInputFieldValues] = useState({
    recipeTitle: recipe.title,
    photoUrl: recipe.photo_url,
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    yield: recipe.yield,
  });
  const [addingNewIngredient, setAddingNewIngredient] = useState(false);
  const [addingNewStep, setAddingNewStep] = useState(false);

  const defaultIngredientInputValues = {
    amount: "",
    ingredient: "",
    component: "",
  };
  const [newIngredientInput, setNewIngredientInput] = useState(
    defaultIngredientInputValues
  );
  const [newInstructionInput, setNewInstructionInput] = useState("");
  const instructions = recipe.instructions;
  const ingredients = recipe.ingredients;

  const saveEditRecipe = () => {
    const updatedRecipe = {
      id: recipe.id,
      title: inputFieldValues.recipeTitle,
      photo_url: inputFieldValues.photoUrl,
      prep_time: inputFieldValues.prepTime,
      cook_time: inputFieldValues.cookTime,
      total_time: inputFieldValues.totalTime,
      yield: inputFieldValues.yield,
      instructions,
      ingredients,
    };
    fetcher.submit(
      {
        formData: updatedRecipe,
      },
      { method: "POST", action: "/editRecipe", encType: "application/json" }
    );
    navigate(0);
  };
  const addIngredient = () => {
    const newIngredient = {
      amount: newIngredientInput.amount,
      ingredient: newIngredientInput.ingredient,
      component:
        newIngredientInput.component !== ""
          ? newIngredientInput.component
          : null,
      recipe_id: recipe.id,
    };
    fetcher.submit(
      { formData: newIngredient },
      {
        method: "POST",
        action: "/addIngredient",
        encType: "application/json",
      }
    );
  };

  return (
    <div className="flex flex-col mx-8 w-full">
      {!editMode ? (
        <h1 className="text-4xl font-semibold text-center">{recipe?.title}</h1>
      ) : (
        <div className="place-self-center w-1/4">
          <input
            className="text-center font-semibold p-2 border-2 border-blue-400 rounded-md w-full text-4xl"
            value={inputFieldValues.recipeTitle}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                recipeTitle: e.target.value,
              })
            }
          />
        </div>
      )}
      <div className="flex justify-center w-full mt-4">
        <span className="h-108 w-96 p-8 border-2 rounded-md border-violet-200 mx-2">
          <img src={recipe?.photo_url} className="rounded-md object-cover" />
          {editMode && (
            <input
              className="border-2 p-4 border-blue-400 w-full rounded-md mt-2"
              value={inputFieldValues.photoUrl}
              onChange={(e) =>
                setInputFieldValues({
                  ...inputFieldValues,
                  photoUrl: e.target.value,
                })
              }
            />
          )}
          {!editMode ? (
            <div className="mt-4 mx-8">
              {recipe.prep_time && (
                <p>
                  <span>Prep time: </span>
                  <span className="font-medium">{recipe.prep_time}</span>
                </p>
              )}
              {recipe.cook_time && (
                <p>
                  <span>Cook time: </span>
                  <span className="font-medium">{recipe.cook_time}</span>
                </p>
              )}
              {recipe.total_time && (
                <p>
                  <span>Total time: </span>
                  <span className="font-medium">{recipe.total_time}</span>
                </p>
              )}
              {recipe.yield && (
                <p>
                  <span>Yield: </span>
                  <span className="font-medium">{recipe.yield}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <div>
                <label htmlFor="prep-time" className="font-medium">
                  Prep time:{" "}
                </label>
                <input
                  value={inputFieldValues.prepTime ?? ""}
                  onChange={(e) =>
                    setInputFieldValues({
                      ...inputFieldValues,
                      prepTime: e.target.value !== "" ? e.target.value : null,
                    })
                  }
                  className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="cook-time" className="font-medium">
                  Cook time:{" "}
                </label>
                <input
                  value={inputFieldValues.cookTime ?? ""}
                  onChange={(e) =>
                    setInputFieldValues({
                      ...inputFieldValues,
                      cookTime: e.target.value !== "" ? e.target.value : null,
                    })
                  }
                  className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="total-time" className="font-medium">
                  Total time:{" "}
                </label>
                <input
                  value={inputFieldValues.totalTime ?? ""}
                  onChange={(e) =>
                    setInputFieldValues({
                      ...inputFieldValues,
                      totalTime: e.target.value !== "" ? e.target.value : null,
                    })
                  }
                  className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
                />
              </div>
              <div className="mt-2">
                <label htmlFor="yield" className="font-medium">
                  Yield:{" "}
                </label>
                <input
                  value={inputFieldValues.yield ?? ""}
                  onChange={(e) =>
                    setInputFieldValues({
                      ...inputFieldValues,
                      yield: e.target.value !== "" ? e.target.value : null,
                    })
                  }
                  className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
                />
              </div>
            </div>
          )}
        </span>
        <span className="p-4 w-1/3 border-2 mx-2 rounded-md border-violet-200">
          <h2 className="text-2xl font-medium mx-2">Ingredients</h2>
          <div className="mx-8 mt-2">
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
                {addingNewIngredient && (
                  <div>
                    <span className="mx-2 text-sm text-emerald-500">✦</span>

                    <span className="">
                      <input
                        value={newIngredientInput.amount}
                        className="border-2 p-2 border-blue-400 rounded-md m-2"
                        onChange={(e) =>
                          setNewIngredientInput({
                            ...newIngredientInput,
                            amount: e.target.value,
                          })
                        }
                      />
                    </span>
                    <span className="w-full">
                      <input
                        value={newIngredientInput.ingredient}
                        className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/2"
                        onChange={(e) =>
                          setNewIngredientInput({
                            ...newIngredientInput,
                            ingredient: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.code === "Enter") {
                            if (newIngredientInput.ingredient !== "") {
                              setAddingNewIngredient(false);
                              setNewIngredientInput(
                                defaultIngredientInputValues
                              );
                              addIngredient();
                            }
                          }
                        }}
                      />
                    </span>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    className="m-4 font-medium text-lg"
                    onClick={() => setAddingNewIngredient(true)}
                  >
                    Add New Ingredient
                  </button>
                </div>
              </div>
            )}
          </div>
        </span>
      </div>
      {editMode && (
        <div className="w-1/6 h-5/6 place-self-end place-content-end fixed mr-48">
          <button
            onClick={saveEditRecipe}
            className="p-4 rounded-md font-semibold text-xl mt-4 mx-16 bg-sky-300"
          >
            Save Changes
          </button>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <div className="p-2 flex-col flex-wrap w-1/2">
          <h3 className="text-2xl font-medium">Instructions</h3>
          {editMode && (
            <div className="flex justify-end">
              <button
                className="text-lg font-medium"
                onClick={() => setAddingNewStep(true)}
              >
                Add Step
              </button>
            </div>
          )}
          {instructions.map((step, index) => {
            const [instructionValue, setInstructionValue] = useState(step);
            if (!editMode) {
              return (
                <div
                  className="mb-4 border-2 border-fuchsia-200 rounded-md p-8"
                  key={index}
                >
                  <span className="font-semibold text-xl">{index + 1}. </span>
                  <span className="text-lg">{step}</span>
                </div>
              );
            } else {
              return (
                <div className="m-2 flex w-full" key={index}>
                  <span className="text-xl mr-4 mt-2 font-semibold">
                    {index + 1}.
                  </span>
                  <span className="w-full">
                    <textarea
                      value={instructionValue}
                      className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
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
          {addingNewStep && (
            <div className="m-2 flex w-full">
              <span className="text-xl mr-4 mt-2 font-semibold">
                {instructions.length + 1}.
              </span>
              <span className="w-full">
                <textarea
                  value={newInstructionInput}
                  className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
                  rows={5}
                  onChange={(e) => setNewInstructionInput(e.target.value)}
                  onBlur={() => instructions.push(newInstructionInput)}
                />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
