-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "yield" TEXT,
ALTER COLUMN "total_time" DROP NOT NULL;
