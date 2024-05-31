/*
  Warnings:

  - A unique constraint covering the columns `[inventory_id]` on the table `IngredientList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IngredientList" ADD COLUMN     "inventory_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "IngredientList_inventory_id_key" ON "IngredientList"("inventory_id");

-- AddForeignKey
ALTER TABLE "IngredientList" ADD CONSTRAINT "IngredientList_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
