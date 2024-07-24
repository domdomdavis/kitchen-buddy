import { Link } from "@remix-run/react";
import { RecipeType } from "~/helpers/types";
type RecipeDisplayProps = {
  recipes: RecipeType[];
};
export const RecipesDisplay = ({ recipes }: RecipeDisplayProps) => {
  return recipes.map((recipe) => (
    <div key={recipe.id} className="flex flex-col items-center">
      <Link to={`/recipes/${recipe.id}`} className="mt-8">
        <p className="font-medium text-xl text-center pb-2" key={recipe.id}>
          {recipe.title}
        </p>
        <img
          src={recipe.photo_url}
          className="object-cover h-80 w-80 rounded-md hover:border-4 hover:border-emerald-300"
        />
      </Link>
    </div>
  ));
};
