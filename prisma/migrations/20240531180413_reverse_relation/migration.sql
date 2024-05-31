/*
  Warnings:

  - You are about to drop the column `inventory_id` on the `IngredientList` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ingredient_id]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "IngredientList" DROP CONSTRAINT "IngredientList_inventory_id_fkey";

-- DropIndex
DROP INDEX "IngredientList_inventory_id_key";

-- AlterTable
ALTER TABLE "IngredientList" DROP COLUMN "inventory_id";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "ingredient_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_ingredient_id_key" ON "Inventory"("ingredient_id");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "IngredientList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
