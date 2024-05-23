-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "ingredients" TEXT[],
    "instructions" TEXT[],
    "cook_time" TEXT NOT NULL,
    "prep_time" TEXT NOT NULL,
    "total_time" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_title_key" ON "Recipe"("title");
