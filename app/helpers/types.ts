export type IngredientType = {
  amount: string;
  ingredient: string;
  component?: string | null;
  recipe_id?: string;
  id?: number;
};

export type IngredientDisplayProps = {
  ingredients: Array<IngredientType>;
};

export type RecipeType = {
  id: string;
  title: string;
  photo_url: string;
  ingredients: IngredientType[];
  instructions: string[];
  cook_time: string | null;
  prep_time: string | null;
  total_time: string | null;
  yield: string | null;
};

export type InventoryType = {
  id: string;
  item: string;
  amount?: string | null;
};

export type UserType = {
  id: string;
  username: string;
  passwordHash: string;
};

export type NoteType = {
  id: string;
  body: string;
  user_id: string;
};
