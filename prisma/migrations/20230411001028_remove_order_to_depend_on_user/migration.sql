/*
  Warnings:

  - You are about to drop the column `waiterId` on the `order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurantTableId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "order_restaurantTableId_fkey" FOREIGN KEY ("restaurantTableId") REFERENCES "restaurantTable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order" ("createdAt", "deletedAt", "id", "restaurantTableId", "status", "updatedAt") SELECT "createdAt", "deletedAt", "id", "restaurantTableId", "status", "updatedAt" FROM "order";
DROP TABLE "order";
ALTER TABLE "new_order" RENAME TO "order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
