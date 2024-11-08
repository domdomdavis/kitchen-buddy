import { FoodItemType, InventoryType, RecipeType } from "~/helpers/types";
import { IngredientDisplay } from "./ingredients/ingredientDisplay";
import { ChangeEvent, useEffect, useState } from "react";
import { EditModeIngredients } from "./ingredients/editModeIngredients";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { InstructionsDisplay } from "./instructionsDisplay";
import { findMissingIngredients } from "~/helpers/findMissingIngredients";
import { LoadingSpinner } from "~/common-components/loadingSpinner";
import { Button } from "~/common-components/button";

type RecipeProps = {
  recipe: RecipeType;
  recipeHasComponents?: boolean;
  editMode: boolean;
  inventory: InventoryType[];
  foodItems: FoodItemType[];
  allRecipes: { id: string; title: string }[];
};

export const Recipe = ({
  recipe,
  recipeHasComponents,
  editMode,
  inventory,
  foodItems,
  allRecipes,
}: RecipeProps) => {
  const ingredientFetcher = useFetcher();
  const instructionFetcher = useFetcher();
  const saveAllFetcher = useFetcher();
  const shoppingListFetcher = useFetcher();
  const navigate = useNavigate();
  const [inputFieldValues, setInputFieldValues] = useState({
    recipeTitle: recipe.title,
    originalRecipe: recipe.original_recipe,
    photoUrl: recipe.photo_url,
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    yield: recipe.yield,
  });
  const [addingNewComponent, setAddingNewComponent] = useState(false);
  const [addingNewIngredient, setAddingNewIngredient] = useState(false);
  const [addingNewStep, setAddingNewStep] = useState(false);
  const defaultIngredientInputValues = {
    ingredient: "",
    component: "",
  };
  const [newIngredientInput, setNewIngredientInput] = useState(
    defaultIngredientInputValues
  );
  const [newInstructionInput, setNewInstructionInput] = useState("");
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [buttonText, setButtonText] = useState(
    "add missing ingredients to shopping list"
  );

  const missingIngredients = findMissingIngredients({
    ingredients,
    inventory,
    foodItems,
  });
  const saveEditRecipe = () => {
    const updatedRecipe = {
      id: recipe.id,
      title: inputFieldValues.recipeTitle,
      original_recipe: inputFieldValues.originalRecipe,
      photo_url: inputFieldValues.photoUrl,
      prep_time: inputFieldValues.prepTime,
      cook_time: inputFieldValues.cookTime,
      total_time: inputFieldValues.totalTime,
      yield: inputFieldValues.yield,
      instructions,
      ingredients,
    };

    saveAllFetcher.submit(
      {
        formData: updatedRecipe,
      },
      { method: "POST", action: "/editRecipe", encType: "application/json" }
    );
  };
  const addIngredient = () => {
    const newIngredient = {
      ingredient: newIngredientInput.ingredient,
      component:
        newIngredientInput.component !== ""
          ? newIngredientInput.component
          : null,
      recipe_id: recipe.id,
    };
    ingredientFetcher.submit(
      { formData: newIngredient },
      {
        method: "POST",
        action: "/addIngredient",
        encType: "application/json",
      }
    );
  };
  const addIngredientsToShoppingList = () => {
    shoppingListFetcher.submit(
      { formData: missingIngredients },
      {
        method: "POST",
        action: "/addIngredientsToShoppingList",
        encType: "application/json",
      }
    );
  };
  const updateInstructions = () => {
    const formData = {
      id: recipe.id,
      instructions,
    };
    instructionFetcher.submit(
      {
        formData,
      },
      {
        method: "POST",
        action: "/updateInstructions",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    if (saveAllFetcher.data) {
      navigate(0);
    } else if (instructionFetcher.data) {
      const fetcherData = instructionFetcher.data as RecipeType;
      setInstructions(fetcherData.instructions);
    } else if (shoppingListFetcher.data) {
      setButtonText("added to shopping list!");
    }
  }, [saveAllFetcher.data, instructionFetcher.data, shoppingListFetcher.data]);

  const recipeComponents: string[] = [];
  const components = new Set(
    ingredients.map((ingredient) => ingredient.component)
  );
  components.forEach((component) => {
    recipeComponents.push(component ?? "");
  });

  const getValueFromDropdown = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "new") setAddingNewComponent(true);
    else
      setNewIngredientInput({
        ...newIngredientInput,
        component: e.target.value,
      });
  };

  return (
    <div className="flex flex-col lg:mx-8 w-full pb-8 lg:mt-2 2xl:mt-0">
      {!editMode ? (
        <div className="text-center mb-4">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-2">
            {recipe?.title}
          </h1>
          {recipe.original_recipe && (
            <Link
              to={recipe.original_recipe ?? "#"}
              className="text-center font-medium border-2 p-2 rounded-md border-orange-300"
              target="_blank"
            >
              go to original recipe
            </Link>
          )}
        </div>
      ) : (
        <div className="place-self-center w-full lg:w-2/3 2xl:w-1/2 flex flex-col items-center">
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
          <input
            className="text-center p-2 border-2 border-blue-400 rounded-md 2xl:w-1/2 mt-4"
            value={inputFieldValues.originalRecipe ?? ""}
            placeholder="Original Recipe URL"
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                originalRecipe: e.target.value,
              })
            }
          />
        </div>
      )}
      <img
        src={recipe.photo_url}
        className="lg:hidden self-center h-60 w-60 object-cover rounded-md mt-4"
      />
      <div className="lg:flex lg:justify-center w-full mt-4">
        <span className="h-108 w-96 lg:p-8 lg:border-2 rounded-md border-violet-300 lg:mx-2">
          <img
            src={inputFieldValues.photoUrl}
            className="rounded-md object-cover hidden lg:flex"
          />
          {editMode && (
            <input
              className="border-2 p-4 border-blue-400 w-full rounded-md mt-2"
              value={inputFieldValues.photoUrl}
              placeholder="Add photo URL"
              onChange={(e) =>
                setInputFieldValues({
                  ...inputFieldValues,
                  photoUrl: e.target.value,
                })
              }
            />
          )}
          {!editMode ? (
            <div className="lg:mt-4 mx-8 self-center">
              {recipe.prep_time && (
                <p className="text-center">
                  <span>Prep time: </span>
                  <span className="font-medium">{recipe.prep_time}</span>
                </p>
              )}
              {recipe.cook_time && (
                <p className="text-center">
                  <span>Cook time: </span>
                  <span className="font-medium">{recipe.cook_time}</span>
                </p>
              )}
              {recipe.total_time && (
                <p className="text-center">
                  <span>Total time: </span>
                  <span className="font-medium">{recipe.total_time}</span>
                </p>
              )}
              {recipe.yield && (
                <p className="text-center">
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
        <span className="p-4 lg:border-2  w-1/2 mx-2 rounded-md border-violet-300">
          <div className="flex w-full justify-between">
            <h2 className="text-2xl font-medium mx-4">Ingredients</h2>{" "}
            {missingIngredients.length > 0 &&
              !editMode &&
              (shoppingListFetcher.state === "idle" ? (
                <Button
                  onClick={addIngredientsToShoppingList}
                  text={buttonText}
                  disabled={buttonText === "added to shopping list!"}
                />
              ) : (
                <LoadingSpinner />
              ))}
          </div>

          <div className="mt-2 mx-4">
            {!editMode ? (
              <IngredientDisplay
                ingredients={ingredients}
                recipeHasComponents={recipeHasComponents}
                inventory={inventory}
                foodItems={foodItems}
                allRecipes={allRecipes}
              />
            ) : (
              <div className="w-full">
                {ingredientFetcher.state !== "idle" && (
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                )}
                <EditModeIngredients
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  recipeHasComponents={recipeHasComponents}
                />
                {addingNewIngredient && (
                  <div>
                    {recipeHasComponents && (
                      <div className="mt-4">
                        <span className="mr-4 text-sm text-fuchsia-500">✦</span>

                        {!addingNewComponent ? (
                          <span>
                            <select
                              defaultValue="default"
                              name="Component"
                              id="component"
                              className="w-1/2 p-2 border-2 border-blue-400 rounded-md"
                              onChange={(e) => getValueFromDropdown(e)}
                            >
                              <option value="default" disabled>
                                Recipe Component
                              </option>
                              <option value="">None</option>
                              {recipeComponents.map((component, index) => {
                                return (
                                  <option value={component} key={index}>
                                    {component}
                                  </option>
                                );
                              })}
                              <option value="new">New Component</option>
                            </select>
                          </span>
                        ) : (
                          <span>
                            <input
                              className="border-2 p-2 border-blue-400 rounded-md m-2 w-1/3"
                              value={newIngredientInput.component}
                              onChange={(e) =>
                                setNewIngredientInput({
                                  ...newIngredientInput,
                                  component: e.target.value,
                                })
                              }
                            />
                          </span>
                        )}
                      </div>
                    )}
                    <div>
                      <span className="mx-2 text-sm text-sky-500">✦</span>
                      <span className="w-full">
                        <input
                          value={newIngredientInput.ingredient}
                          className="border-2 p-2 border-blue-400 rounded-md m-2 w-2/3"
                          onChange={(e) =>
                            setNewIngredientInput({
                              ...newIngredientInput,
                              ingredient: e.target.value,
                            })
                          }
                        />
                        <button
                          className={`ml-6 font-medium border-2 rounded-md p-2 ${
                            newIngredientInput.ingredient !== ""
                              ? "border-orange-300"
                              : "border-gray-300 text-gray-300"
                          }`}
                          disabled={newIngredientInput.ingredient === ""}
                          onClick={() => {
                            if (newIngredientInput.ingredient !== "") {
                              ingredients.push(newIngredientInput);
                              setIngredients([...ingredients]);
                              if (addingNewComponent)
                                setAddingNewComponent(false);
                              setAddingNewIngredient(false);
                              setNewIngredientInput(
                                defaultIngredientInputValues
                              );
                              addIngredient();
                            }
                          }}
                        >
                          save ingredient
                        </button>
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    onClick={() => setAddingNewIngredient(true)}
                    text="Add New Ingredient"
                  />
                </div>
              </div>
            )}
          </div>
        </span>
      </div>

      <div className="flex justify-center mt-4">
        <div className="flex-col flex-wrap w-full lg:w-3/4 2xl:w-4/5">
          <h3 className="text-2xl font-medium mx-4">Instructions</h3>
          {editMode && (
            <div className="flex justify-end">
              <Button onClick={() => setAddingNewStep(true)} text="Add Step" />
            </div>
          )}
          {instructionFetcher.state !== "idle" && (
            <div className="flex justify-center backdrop-blur">
              <LoadingSpinner />
            </div>
          )}
          <InstructionsDisplay
            instructions={instructions}
            editMode={editMode}
            setInstructions={setInstructions}
            updateInstructions={updateInstructions}
          />
          {addingNewStep && (
            <div className="m-2 flex w-full">
              <span className="text-xl mr-4 mt-2 font-semibold">
                {instructions.length + 1}.
              </span>
              <span className="w-11/12">
                <textarea
                  value={newInstructionInput}
                  className="border-2 p-2 border-blue-400 rounded-md w-full mt-2"
                  rows={5}
                  onChange={(e) => setNewInstructionInput(e.target.value)}
                  onBlur={() => {
                    if (newInstructionInput !== "") {
                      setAddingNewStep(false);
                      setNewInstructionInput("");
                      instructions.push(newInstructionInput);
                      setInstructions([...instructions]);
                    }
                  }}
                />
              </span>
            </div>
          )}
        </div>
      </div>
      {editMode && (
        <div>
          <div className="flex justify-center w-11/12">
            <button
              onClick={saveEditRecipe}
              className={`p-4 rounded-md font-semibold text-xl mx-16 ${
                saveAllFetcher.state === "idle"
                  ? "bg-gradient-to-r from-fuchsia-400 to-orange-400"
                  : "bg-gray-500"
              }`}
              disabled={saveAllFetcher.state !== "idle"}
            >
              Save Changes
            </button>
          </div>
          {saveAllFetcher.state !== "idle" && (
            <div className="flex justify-center pb-2">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
