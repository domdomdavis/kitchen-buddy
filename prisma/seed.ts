import { PrismaClient } from "@prisma/client";
// const seedData = [
//   {
//     title: "Easy Cinnamon Rolls From Scratch",
//     photo_url:
//       "https://sallysbakingaddiction.com/wp-content/uploads/2013/05/easy-cinnamon-rolls-with-cream-cheese-frosting.jpg",
//     ingredients: [
//       {
//         amount: "2 and 3/4 cups",
//         ingredient: "all-purpose flour (spooned & leveled)",
//         component: "Dough",
//       },
//       {
//         amount: "1/4 cup",
//         ingredient: "granulated sugar",
//         component: "Dough",
//       },
//       {
//         amount: "1/2 teaspoon",
//         ingredient: "salt",
//         component: "Dough",
//       },
//       {
//         amount: "3/4 cup",
//         ingredient: "whole milk",
//         component: "Dough",
//       },
//       {
//         amount: "3 Tablespoons",
//         ingredient: "unsalted butter",
//         component: "Dough",
//       },
//       {
//         amount: "2 1/4 teaspoons",
//         ingredient: "instant yeast",
//         component: "Dough",
//       },
//       {
//         amount: "1",
//         ingredient: "large egg",
//         component: "Dough",
//       },
//       {
//         amount: "3 Tablespoons",
//         ingredient: "unsalted butter, extra softened",
//         component: "Filling",
//       },
//       {
//         amount: "1/3 cup",
//         ingredient: "brown sugar",
//         component: "Filling",
//       },
//       {
//         amount: "1 Tablespoon",
//         ingredient: "ground cinnamon",
//         component: "Filling",
//       },
//       {
//         amount: "4 ounces",
//         ingredient: "cream cheese, softened to room temperature",
//         component: "Cream Cheese Icing",
//       },
//       {
//         amount: "2 Tablespoons",
//         ingredient: "cream cheese, softened to room temperature",
//         component: "Cream Cheese Icing",
//       },
//       {
//         amount: "2/3 cup",
//         ingredient: "cream cheese, softened to room temperature",
//         component: "Cream Cheese Icing",
//       },
//       {
//         amount: "1 teaspoon",
//         ingredient: "pure vanilla extract",
//         component: "Cream Cheese Icing",
//       },
//     ],
//     instructions: [
//       "Make the dough: Whisk the flour, sugar, and salt together in a large bowl. Set aside.",
//       "Combine the milk and butter together in a heatproof bowl. Microwave or use the stove and heat until the butter has melted and the mixture is warm to the touch (about 110°F/43°C, no higher). Whisk in the yeast until it has dissolved. Pour mixture into the dry ingredients, add the egg, and stir with a sturdy rubber spatula or wooden spoon OR use a stand mixer with a paddle attachment on medium speed. Mix until a soft dough forms.",
//       "Transfer dough to a lightly floured surface. Using floured hands, knead the dough for 3-5 minutes. You should have a smooth ball of dough. If the dough is super soft or sticky, you can add a little more flour. Place in a lightly greased bowl (I use non-stick spray), cover loosely, and let the dough rest for about 10 minutes as you get the filling ingredients ready.",
//       "Fill the rolls: After 10 minutes, roll the dough out in a 14×8-inch (36×20-cm) rectangle. Spread the softened butter on top. Mix together the cinnamon and brown sugar. Sprinkle it all over the dough. Roll up the dough to make a 14-inch log. Cut into 10–12 even rolls and arrange in a lightly greased 9- or 10-inch round cake pan, pie dish, or square baking pan.",
//       "Rise: Cover the pan with aluminum foil, plastic wrap, or a clean kitchen towel. Allow the rolls to rise in a relatively warm environment for 60–90 minutes or until double in size.",
//       "Bake the rolls: After the rolls have doubled in size, preheat the oven to 375°F (190°C). Bake for 24–27 minutes, or until lightly browned. If you notice the tops are getting too brown too quickly, loosely tent the pan with aluminum foil and continue baking. If you want to be precise about their doneness, their internal temperature taken with an instant read thermometer should be around 195–200°F (91–93°C) when done. Remove pan from the oven and place pan on a wire rack as you make the icing. (You can also make the icing as the rolls bake.)",
//       "Make the icing: In a medium bowl using a handheld or stand mixer fitted with a paddle or whisk attachment, beat the cream cheese on high speed until smooth and creamy. Add the butter and beat until smooth and combined, then beat in the confectioners’ sugar and vanilla until combined. Using a knife or icing spatula, spread the icing over the warm rolls and serve immediately.",
//       "Cover leftover frosted or unfrosted rolls tightly and store at room temperature for up to 2 days or in the refrigerator for up to 5 days.",
//     ],
//     prep_time: "1 hour, 40 minutes",
//     cook_time: "25 minutes",
//     total_time: "2 hours, 5 minutes",
//     yield: "10-12 rolls",
//   },
// ];
async function seed() {
  const prisma = new PrismaClient();

  try {
    await prisma.recipe.create({
      data: {
        title: "Easy Cinnamon Rolls From Scratch",
        photo_url:
          "https://sallysbakingaddiction.com/wp-content/uploads/2013/05/easy-cinnamon-rolls-with-cream-cheese-frosting.jpg",
        ingredients: {
          createMany: {
            data: [
              {
                amount: "2 and 3/4 cups",
                ingredient: "all-purpose flour (spooned & leveled)",
                component: "Dough",
              },
              {
                amount: "1/4 cup",
                ingredient: "granulated sugar",
                component: "Dough",
              },
              {
                amount: "1/2 teaspoon",
                ingredient: "salt",
                component: "Dough",
              },
              {
                amount: "3/4 cup",
                ingredient: "whole milk",
                component: "Dough",
              },
              {
                amount: "3 Tablespoons",
                ingredient: "unsalted butter",
                component: "Dough",
              },
              {
                amount: "2 1/4 teaspoons",
                ingredient: "instant yeast",
                component: "Dough",
              },
              {
                amount: "1",
                ingredient: "large egg",
                component: "Dough",
              },
              {
                amount: "3 Tablespoons",
                ingredient: "unsalted butter, extra softened",
                component: "Filling",
              },
              {
                amount: "1/3 cup",
                ingredient: "brown sugar",
                component: "Filling",
              },
              {
                amount: "1 Tablespoon",
                ingredient: "ground cinnamon",
                component: "Filling",
              },
              {
                amount: "4 ounces",
                ingredient: "cream cheese, softened to room temperature",
                component: "Cream Cheese Icing",
              },
              {
                amount: "2 Tablespoons",
                ingredient: "cream cheese, softened to room temperature",
                component: "Cream Cheese Icing",
              },
              {
                amount: "2/3 cup",
                ingredient: "cream cheese, softened to room temperature",
                component: "Cream Cheese Icing",
              },
              {
                amount: "1 teaspoon",
                ingredient: "pure vanilla extract",
                component: "Cream Cheese Icing",
              },
            ],
          },
        },
        instructions: [
          "Make the dough: Whisk the flour, sugar, and salt together in a large bowl. Set aside.",
          "Combine the milk and butter together in a heatproof bowl. Microwave or use the stove and heat until the butter has melted and the mixture is warm to the touch (about 110°F/43°C, no higher). Whisk in the yeast until it has dissolved. Pour mixture into the dry ingredients, add the egg, and stir with a sturdy rubber spatula or wooden spoon OR use a stand mixer with a paddle attachment on medium speed. Mix until a soft dough forms.",
          "Transfer dough to a lightly floured surface. Using floured hands, knead the dough for 3-5 minutes. You should have a smooth ball of dough. If the dough is super soft or sticky, you can add a little more flour. Place in a lightly greased bowl (I use non-stick spray), cover loosely, and let the dough rest for about 10 minutes as you get the filling ingredients ready.",
          "Fill the rolls: After 10 minutes, roll the dough out in a 14×8-inch (36×20-cm) rectangle. Spread the softened butter on top. Mix together the cinnamon and brown sugar. Sprinkle it all over the dough. Roll up the dough to make a 14-inch log. Cut into 10–12 even rolls and arrange in a lightly greased 9- or 10-inch round cake pan, pie dish, or square baking pan.",
          "Rise: Cover the pan with aluminum foil, plastic wrap, or a clean kitchen towel. Allow the rolls to rise in a relatively warm environment for 60–90 minutes or until double in size.",
          "Bake the rolls: After the rolls have doubled in size, preheat the oven to 375°F (190°C). Bake for 24–27 minutes, or until lightly browned. If you notice the tops are getting too brown too quickly, loosely tent the pan with aluminum foil and continue baking. If you want to be precise about their doneness, their internal temperature taken with an instant read thermometer should be around 195–200°F (91–93°C) when done. Remove pan from the oven and place pan on a wire rack as you make the icing. (You can also make the icing as the rolls bake.)",
          "Make the icing: In a medium bowl using a handheld or stand mixer fitted with a paddle or whisk attachment, beat the cream cheese on high speed until smooth and creamy. Add the butter and beat until smooth and combined, then beat in the confectioners’ sugar and vanilla until combined. Using a knife or icing spatula, spread the icing over the warm rolls and serve immediately.",
          "Cover leftover frosted or unfrosted rolls tightly and store at room temperature for up to 2 days or in the refrigerator for up to 5 days.",
        ],
        prep_time: "1 hour, 40 minutes",
        cook_time: "25 minutes",
        total_time: "2 hours, 5 minutes",
        yield: "10-12 rolls",
      },
    });
  } catch (e) {
    console.log("Error seeding data:", e);
  } finally {
    await prisma.$disconnect;
  }
}

seed();
