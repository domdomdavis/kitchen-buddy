import { Link, redirect, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IngredientType, RecipeType } from "~/helpers/types";

export default function NewRecipe() {
  const fetcher = useFetcher();

  const [instructions, setInstructions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [recipeTitle, setRecipeTitle] = useState<string>("");
  const [amountValue, setAmountValue] = useState("");
  const [ingredientValue, setIngredientValue] = useState("");
  const [instructionValue, setInstructionValue] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const saveRecipe = () => {
    const newRecipe = {
      title: recipeTitle,
      photo_url: photoUrl,
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
      redirect(`/recipes/${fetcherData.id}`);
    }
  }, [fetcher.data]);
  return (
    <div className="p-4">
      <Link to="/" className="text-xl pb-2">
        Back
      </Link>
      <h1 className="text-4xl font-semibold">Add New Recipe</h1>
      <div className="flex space-between">
        <form className="p-4 flex flex-col">
          <input
            name="title"
            id="title"
            className="w-96 p-4 border-2 border-violet-300 rounded-md mb-2"
            placeholder="Recipe Title"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />
          <input
            name="photo_url"
            id="photo_url"
            value={photoUrl ?? ""}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-96 p-4 border-2 border-violet-300 rounded-md"
            placeholder="Photo URL"
          />
          <div className="flex flex-col mt-4">
            <label htmlFor="ingredients">Add Ingredients</label>

            <input
              name="component"
              id="component"
              className="w-full p-4 border-2 border-violet-300 rounded-md"
              placeholder="Recipe Component (optional)"
            />
            <div className="flex-row">
              {" "}
              <span>
                <input
                  name="amount"
                  id="amount"
                  className="w-36 p-4  mr-4 mt-4 border-2 border-violet-300 rounded-md"
                  placeholder="Amount"
                  value={amountValue}
                  onChange={(e) => setAmountValue(e.target.value)}
                />
              </span>
              <span>
                <input
                  name="ingredient"
                  id="ingredient"
                  className="w-64 p-4 border-2 border-violet-300 rounded-md"
                  placeholder="Ingredient"
                  value={ingredientValue}
                  onChange={(e) => setIngredientValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      if (ingredientValue !== "") {
                        const newIngredient = {
                          amount: amountValue,
                          ingredient: ingredientValue,
                        };
                        setIngredients([...ingredients, newIngredient]);
                        setAmountValue("");
                        setIngredientValue("");
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
              value={instructionValue}
              onChange={(e) => setInstructionValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  if (instructionValue !== "") {
                    setInstructionValue("");
                    setInstructions([...instructions, instructionValue]);
                  }
                }
              }}
            />
          </div>
        </form>
        <div className="mx-8">
          {ingredients.length > 0 &&
            ingredients.map((ingredient, index) => {
              return (
                <div key={index}>
                  <span className="font-semibold">{ingredient.amount} </span>
                  <span>{ingredient.ingredient}</span>
                  <button
                    onClick={() => {
                      ingredients.splice(index, 1);
                      setIngredients([...ingredients]);
                    }}
                    className="ml-6 text-sm"
                  >
                    remove
                  </button>
                </div>
              );
            })}
          <div className="mt-8 max-w-96">
            {" "}
            {instructions.length > 0 &&
              instructions.map((instruction, index) => {
                if (instruction !== "") {
                  return (
                    <div key={index} className="mt-2">
                      <span>{index + 1}. </span>
                      <span>{instruction}</span>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className="flex flex-col mx-auto">
          {recipeTitle !== "" && (
            <h2 className="text-2xl font-semibold">{recipeTitle}</h2>
          )}
          {photoUrl !== "" && <img src={photoUrl} className="h-96 w-64" />}
        </div>
      </div>
      <button
        onClick={saveRecipe}
        className="mt-2 p-4 mx-16 bg-sky-400 rounded-md font-semibold text-lg"
      >
        Save Recipe
      </button>
    </div>
  );
}
