import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
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
    photoUrl: "",
    component: "",
    amount: "",
    ingredient: "",
    instruction: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    yield: "",
  };
  const [inputFieldValues, setInputFieldValues] = useState(defaultInputValues);

  const saveRecipe = () => {
    const newRecipe = {
      title: inputFieldValues.title,
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
    <div className="grid p-4 w-full">
      <div className="flex justify-between place-self-center w-11/12 mt-2">
        <form className="flex flex-col">
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
              className="w-full p-4 border-2 border-violet-300 rounded-md mb-2"
              placeholder="Recipe Component (optional)"
              value={inputFieldValues.component}
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
            <div className="flex-row">
              <span>
                <input
                  name="amount"
                  id="amount"
                  className="lg:w-36 p-4 w-full lg:mr-4 mb-2 border-2 border-violet-300 rounded-md"
                  placeholder="Amount"
                  value={inputFieldValues.amount}
                  onChange={(e) =>
                    setInputFieldValues({
                      ...inputFieldValues,
                      amount: e.target.value,
                    })
                  }
                />
              </span>
              <span>
                <input
                  name="ingredient"
                  id="ingredient"
                  className="lg:w-64 w-full p-4 border-2 border-violet-300 rounded-md"
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
                          amount: inputFieldValues.amount,
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
                          amount: "",
                          ingredient: "",
                        });
                        document.getElementById("amount")?.focus();
                      }
                    }
                  }}
                />
              </span>
            </div>
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
        <div className="w-1/4 mx-4 hidden lg:flex">
          {instructions.length > 0 &&
            instructions.map((step, index) => {
              return (
                <div className="mb-4" key={index}>
                  <span className="font-semibold text-xl">{index + 1}. </span>
                  <span className="text-lg">{step}</span>
                </div>
              );
            })}
        </div>
        <div className="hidden lg:flex">
          <IngredientDisplay
            ingredients={ingredients}
            setIngredients={setIngredients}
            recipeHasComponents={components.length > 0}
          />
        </div>
        <div className="mx-16 items-center hidden lg:flex lg:flex-col">
          {inputFieldValues.title !== "" && (
            <h2 className="text-2xl font-semibold mb-4">
              {inputFieldValues.title}
            </h2>
          )}
          {inputFieldValues.photoUrl !== "" && (
            <img
              src={inputFieldValues.photoUrl}
              className="h-96 w-72 rounded-md object-cover mb-4"
            />
          )}
          {inputFieldValues.prepTime !== "" && (
            <p className="text-lg">
              <span>Prep time: </span>
              <span className="font-medium">{inputFieldValues.prepTime}</span>
            </p>
          )}
          {inputFieldValues.cookTime !== "" && (
            <p className="text-lg">
              <span>Cook time: </span>
              <span className="font-medium">{inputFieldValues.cookTime}</span>
            </p>
          )}
          {inputFieldValues.totalTime !== "" && (
            <p className="text-lg">
              <span>Total time: </span>
              <span className="font-medium">{inputFieldValues.totalTime}</span>
            </p>
          )}
          {inputFieldValues.yield !== "" && (
            <p className="text-lg">
              <span>Yield: </span>
              <span className="font-medium">{inputFieldValues.yield}</span>
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="justify-center">
          <button
            onClick={saveRecipe}
            className="m-4 p-4 bg-gradient-to-r from-sky-300 to-green-300 border-2 border-sky-300 rounded-md font-semibold text-lg"
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
