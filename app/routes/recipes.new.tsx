import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "~/common-components/loadingSpinner";
import { IngredientType, RecipeType } from "~/helpers/types";
import { IngredientDisplay } from "~/route-components/ingredients/ingredientDisplay";

export default function NewRecipe() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [components, setComponents] = useState<string[]>([]);
  const defaultInputValues = {
    title: "",
    originalRecipe: "",
    photoUrl: "",
    component: "",
    ingredient: "",
    instruction: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    yield: "",
  };
  const [inputFieldValues, setInputFieldValues] = useState(defaultInputValues);
  const disableComponentField =
    ingredients.length !== 0 && components.length === 0;

  const saveRecipe = () => {
    const newRecipe = {
      title: inputFieldValues.title,
      original_recipe:
        inputFieldValues.originalRecipe !== ""
          ? inputFieldValues.originalRecipe
          : null,
      photo_url: inputFieldValues.photoUrl,
      prep_time:
        inputFieldValues.prepTime !== "" ? inputFieldValues.prepTime : null,
      cook_time:
        inputFieldValues.cookTime !== "" ? inputFieldValues.cookTime : null,
      total_time:
        inputFieldValues.totalTime !== "" ? inputFieldValues.totalTime : null,
      yield: inputFieldValues.yield !== "" ? inputFieldValues.yield : null,
      ingredients,
      instructions,
    };
    fetcher.submit(
      { formData: newRecipe },
      {
        method: "POST",
        action: "/addRecipe",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      const fetcherData = fetcher.data as RecipeType;
      navigate(`/recipes/${fetcherData.id}`);
    }
  }, [fetcher.data]);
  return (
    <div className="p-4 w-full">
      <div className="flex w-full">
        <form className="flex flex-col px-4 w-full lg:w-1/2 2xl:w-1/4">
          <h1 className="text-3xl text-center font-semibold mb-4">
            Add New Recipe
          </h1>
          <input
            name="title"
            id="title"
            className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            placeholder="Recipe Title"
            value={inputFieldValues.title}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                title: e.target.value,
              })
            }
          />
          <input
            name="photo_url"
            id="photo_url"
            value={inputFieldValues.photoUrl ?? ""}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                photoUrl: e.target.value,
              })
            }
            className="w-full p-4 border-2 border-violet-300 rounded-md  mb-2"
            placeholder="Photo URL"
          />
          <input
            name="original_recipe"
            id="original_recipe"
            className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
            placeholder="Original Recipe URL (optional)"
            value={inputFieldValues.originalRecipe}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                originalRecipe: e.target.value,
              })
            }
          />
          <input
            value={inputFieldValues.prepTime ?? ""}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                prepTime: e.target.value,
              })
            }
            placeholder="Prep Time (optional)"
            className="w-full p-4 border-2 border-violet-300 rounded-md  mb-2"
          />

          <input
            value={inputFieldValues.cookTime ?? ""}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                cookTime: e.target.value,
              })
            }
            placeholder="Cook Time (optional)"
            className="w-full p-4 border-2 border-violet-300 rounded-md  mb-2"
          />

          <input
            value={inputFieldValues.totalTime ?? ""}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                totalTime: e.target.value,
              })
            }
            placeholder="Total Time (optional)"
            className="w-full p-4 border-2 border-violet-300 rounded-md  mb-2"
          />

          <input
            value={inputFieldValues.yield ?? ""}
            onChange={(e) =>
              setInputFieldValues({
                ...inputFieldValues,
                yield: e.target.value,
              })
            }
            placeholder="Yield (optional)"
            className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
          />

          <div className="flex flex-col mt-4">
            <label htmlFor="ingredients">Add Ingredients</label>

            <input
              name="component"
              id="component"
              className={`w-full p-4 border-2 ${
                disableComponentField
                  ? "border-gray-300 bg-gray-100"
                  : "border-violet-300"
              } rounded-md mb-2`}
              placeholder={`${
                !disableComponentField ? "Recipe Component (optional)" : ""
              }`}
              value={inputFieldValues.component}
              disabled={disableComponentField}
              onChange={(e) =>
                setInputFieldValues({
                  ...inputFieldValues,
                  component: e.target.value,
                })
              }
              onBlur={(e) => {
                if (inputFieldValues.component !== "")
                  setComponents([...components, e.target.value]);
              }}
            />

            <input
              name="ingredient"
              id="ingredient"
              className="w-full p-4 border-2 border-violet-300 rounded-md"
              placeholder="Ingredient"
              value={inputFieldValues.ingredient}
              onChange={(e) =>
                setInputFieldValues({
                  ...inputFieldValues,
                  ingredient: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  if (inputFieldValues.ingredient !== "") {
                    const newIngredient = {
                      ingredient: inputFieldValues.ingredient,
                      component:
                        components.length > 0
                          ? components[components.length - 1]
                          : null,
                    };
                    setIngredients([...ingredients, newIngredient]);
                    setInputFieldValues({
                      ...inputFieldValues,
                      component: "",
                      ingredient: "",
                    });
                    document.getElementById("amount")?.focus();
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="Instructions">Add Instructions</label>
            <label htmlFor="addStep" className="mt-4">
              Add Step
            </label>
            <textarea
              name="step"
              id="step"
              rows={4}
              cols={5}
              className="w-full h-24 p-4 flex-wrap border-2 border-violet-300 rounded-md"
              placeholder={`Step ${instructions.length + 1}`}
              value={inputFieldValues.instruction}
              onChange={(e) =>
                setInputFieldValues({
                  ...inputFieldValues,
                  instruction: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  if (inputFieldValues.instruction !== "") {
                    setInputFieldValues({
                      ...inputFieldValues,
                      instruction: "",
                    });
                    setInstructions([
                      ...instructions,
                      inputFieldValues.instruction,
                    ]);
                  }
                }
              }}
            />
          </div>
        </form>
        {fetcher.state !== "idle" ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="hidden lg:block w-full">
            <div className="m-8 hidden lg:flex justify-around">
              <div className="flex-col">
                {inputFieldValues.title !== "" ? (
                  <h2 className="text-2xl text-center font-medium mb-4 w-full">
                    {inputFieldValues.title}
                  </h2>
                ) : (
                  <p>Recipe preview will be displayed here.</p>
                )}
                {inputFieldValues.photoUrl !== "" && (
                  <img
                    src={inputFieldValues.photoUrl}
                    className="h-80 w-64 rounded-md object-cover mb-4"
                  />
                )}
                {inputFieldValues.prepTime !== "" && (
                  <p>
                    <span>Prep time: </span>
                    <span className="font-medium">
                      {inputFieldValues.prepTime}
                    </span>
                  </p>
                )}
                {inputFieldValues.cookTime !== "" && (
                  <p>
                    <span>Cook time: </span>
                    <span className="font-medium">
                      {inputFieldValues.cookTime}
                    </span>
                  </p>
                )}
                {inputFieldValues.totalTime !== "" && (
                  <p>
                    <span>Total time: </span>
                    <span className="font-medium">
                      {inputFieldValues.totalTime}
                    </span>
                  </p>
                )}
                {inputFieldValues.yield !== "" && (
                  <p>
                    <span>Yield: </span>
                    <span className="font-medium">
                      {inputFieldValues.yield}
                    </span>
                  </p>
                )}
              </div>
              <div>
                <IngredientDisplay
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  recipeHasComponents={components.length > 0}
                />
              </div>
            </div>
            <div className="mx-8 h-96 overflow-y-auto">
              {instructions.length > 0 &&
                instructions.map((step, index) => {
                  return (
                    <div className="mb-4" key={index}>
                      <span className="font-semibold text-xl">
                        {index + 1}.{" "}
                      </span>
                      <span className="text-lg">{step}</span>
                      <button
                        className="ml-4"
                        onClick={() => {
                          instructions.splice(index, 1);
                          setInstructions([...instructions]);
                        }}
                      >
                        remove
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center mt-4">
        <div className="justify-center">
          <button
            onClick={saveRecipe}
            className="m-4 p-4 bg-gradient-to-r border-2 border-fuchsia-500 rounded-md font-semibold text-lg"
          >
            Save Recipe
          </button>
          <button
            className="ml-4 p-4 mx-auto border-2 border-sky-400 rounded-md font-semibold text-lg"
            onClick={() => {
              setInputFieldValues(defaultInputValues);
              setIngredients([]);
              setInstructions([]);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
