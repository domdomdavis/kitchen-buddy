/*
  Warnings:

  - You are about to drop the column `ingredients` on the `Recipe` table. All the data in the column will be lost.
  - Made the column `total_time` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "ingredients",
ALTER COLUMN "total_time" SET NOT NULL;

-- CreateTable
CREATE TABLE "IngredientList" (
    "id" SERIAL NOT NULL,
    "amount" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "component" TEXT,
    "recipe_id" TEXT NOT NULL,

    CONSTRAINT "IngredientList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IngredientList" ADD CONSTRAINT "IngredientList_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
