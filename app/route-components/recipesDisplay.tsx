import { Link } from "@remix-run/react";
import { RecipeType } from "~/helpers/types";
type RecipeDisplayProps = {
  recipes: RecipeType[];
};
export const RecipesDisplay = ({ recipes }: RecipeDisplayProps) => {
  return recipes.map((recipe) => (
    <div key={recipe.id} className="flex flex-col w-96 h-96">
      <Link to={`/recipes/${recipe.id}`}>
        <p className="font-semibold text-xl text-center" key={recipe.id}>
          {recipe.title}
        </p>
        <img
          src={recipe.photo_url}
          className="object-scale-down border-4 border-violet-400 rounded-md"
        />
      </Link>
    </div>
  ));
};
