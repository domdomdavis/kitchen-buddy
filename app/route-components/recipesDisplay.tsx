import { Link } from "@remix-run/react";
import { RecipeType } from "~/helpers/types";
type RecipeDisplayProps = {
  recipes: RecipeType[];
};
export const RecipesDisplay = ({ recipes }: RecipeDisplayProps) => {
  return recipes.map((recipe) => (
    <div key={recipe.id} className="flex flex-col">
      <Link to={`/recipes/${recipe.id}`}>
        <p className="font-semibold text-xl text-center" key={recipe.id}>
          {recipe.title}
        </p>
        <img
          src={recipe.photo_url}
          className="object-cover border-4 border-violet-400 rounded-md h-80 w-80"
        />
      </Link>
    </div>
  ));
};
