import { PrismaClient } from "@prisma/client";
import { getUser } from "~/utils/session.server";

type ActionProps = {
  request: Request;
};

export const action = async ({ request }: ActionProps) => {
  const prisma = new PrismaClient();
  const user = await getUser(request);
  const { formData } = await request.json();
  if (user) {
    const newRecipe = await prisma.recipe.create({
      data: {
        user_id: user.id,
        title: formData.title,
        photo_url: formData.photo_url,
        prep_time: formData.prep_time,
        cook_time: formData.cook_time,
        total_time: formData.total_time,
        yield: formData.yield,
        ingredients: {
          create: formData.ingredients,
        },
        instructions: formData.instructions,
      },
      include: {
        ingredients: true,
      },
    });
    return newRecipe;
  }
};
