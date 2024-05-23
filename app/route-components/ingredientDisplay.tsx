export const IngredientDisplay = ({ ingredients }) => {
  return ingredients.map((ingredient) => (
    <p>
      {ingredient.amount} {ingredient.ingredient}
    </p>
  ));
};
