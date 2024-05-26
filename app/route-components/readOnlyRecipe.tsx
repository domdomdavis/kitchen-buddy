import { RecipeType } from "~/helpers/types";
import { IngredientWithComponentDisplay } from "./ingredientWithComponentDisplay";
import { IngredientDisplay } from "./ingredientDisplay";
import { InstructionsDisplay } from "./instructionsDisplay";

type ReadOnlyRecipeProps = {
  recipe: RecipeType;
  recipeHasComponents?: boolean;
};

export const ReadOnlyRecipe = ({
  recipe,
  recipeHasComponents,
}: ReadOnlyRecipeProps) => {
  return (
    <div>
      <h1 className="text-4xl font-semibold p-8">{recipe?.title}</h1>
      <div className="flex">
        <span className="h-108 w-96 p-8">
          <img src={recipe?.photo_url} className="object-scale-down" />
        </span>
        <span className="p-8">
          {recipeHasComponents ? (
            <IngredientWithComponentDisplay
              ingredients={recipe?.ingredients ?? []}
            />
          ) : (
            <IngredientDisplay ingredients={recipe?.ingredients ?? []} />
          )}
        </span>
      </div>
      <div className="p-8 flex flex-col flex-wrap w-1/2">
        <InstructionsDisplay instructions={recipe?.instructions} />
      </div>
    </div>
  );
};
