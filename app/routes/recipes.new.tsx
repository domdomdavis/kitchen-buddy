import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { HomeButton } from "~/common-components/homeButton";
import { IngredientType, RecipeType } from "~/helpers/types";
import { IngredientDisplay } from "~/route-components/ingredientDisplay";

export default function NewRecipe() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [components, setComponents] = useState<string[]>([]);
  const [inputFieldValues, setInputFieldValues] = useState({
    title: "",
    photoUrl: "",
    component: "",
    amount: "",
    ingredient: "",
    instruction: "",
  });

  const saveRecipe = () => {
    const newRecipe = {
      title: inputFieldValues.title,
      photo_url: inputFieldValues.photoUrl,
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
    <div className="p-8 w-full">
      <HomeButton />

      <div className="flex justify-evenly w-full">
        <form className="flex flex-col">
          <h1 className="text-3xl text-center font-semibold mb-8">
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
            className="w-full p-4 border-2 border-violet-300 rounded-md"
            placeholder="Photo URL"
          />
          <div className="flex flex-col mt-4">
            <label htmlFor="ingredients">Add Ingredients</label>

            <input
              name="component"
              id="component"
              className="w-full p-4 border-2 border-violet-300 rounded-md"
              placeholder="Recipe Component (optional)"
              value={inputFieldValues.component}
              onChange={(e) =>
                setInputFieldValues({
                  ...inputFieldValues,
                  component: e.target.value,
                })
              }
              onBlur={(e) => setComponents([...components, e.target.value])}
            />
            <div className="flex-row">
              <span>
                <input
                  name="amount"
                  id="amount"
                  className="w-36 p-4  mr-4 mt-4 border-2 border-violet-300 rounded-md"
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
                  className="w-64 p-4 border-2 border-violet-300 rounded-md"
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
        <div className="w-1/4">
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
        <div>
          <IngredientDisplay
            ingredients={ingredients}
            setIngredients={setIngredients}
            recipeHasComponents={components.length > 0}
          />
        </div>
        <div className="flex flex-col mx-16 items-center">
          {inputFieldValues.title !== "" && (
            <h2 className="text-2xl font-semibold mb-4">
              {inputFieldValues.title}
            </h2>
          )}
          {inputFieldValues.photoUrl !== "" && (
            <img
              src={inputFieldValues.photoUrl}
              className="h-96 w-64 rounded-md"
            />
          )}
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="justify-center">
          <button
            onClick={saveRecipe}
            className="m-4 p-4 bg-sky-400 border-2 border-sky-400 rounded-md font-semibold text-lg"
          >
            Save Recipe
          </button>
          <button className="ml-4 p-4 mx-auto border-2 border-sky-400 rounded-md font-semibold text-lg">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
