-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "amount" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_item_key" ON "Inventory"("item");
