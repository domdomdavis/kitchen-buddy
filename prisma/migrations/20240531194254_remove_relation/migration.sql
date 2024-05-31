/*
  Warnings:

  - You are about to drop the column `ingredient_id` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_ingredient_id_fkey";

-- DropIndex
DROP INDEX "Inventory_ingredient_id_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "ingredient_id";
