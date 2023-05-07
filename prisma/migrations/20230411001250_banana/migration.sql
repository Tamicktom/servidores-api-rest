/*
  Warnings:

  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `orderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `restaurantTable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `item` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantTableId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "order_restaurantTableId_fkey" FOREIGN KEY ("restaurantTableId") REFERENCES "restaurantTable" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order" ("createdAt", "deletedAt", "id", "restaurantTableId", "status", "updatedAt") SELECT "createdAt", "deletedAt", "id", "restaurantTableId", "status", "updatedAt" FROM "order";
DROP TABLE "order";
ALTER TABLE "new_order" RENAME TO "order";
CREATE TABLE "new_orderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orderItem" ("createdAt", "deletedAt", "id", "itemId", "orderId", "quantity", "updatedAt") SELECT "createdAt", "deletedAt", "id", "itemId", "orderId", "quantity", "updatedAt" FROM "orderItem";
DROP TABLE "orderItem";
ALTER TABLE "new_orderItem" RENAME TO "orderItem";
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'WAITER'
);
INSERT INTO "new_user" ("createdAt", "deletedAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "deletedAt", "email", "id", "name", "password", "role", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE TABLE "new_restaurantTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE'
);
INSERT INTO "new_restaurantTable" ("createdAt", "deletedAt", "id", "number", "status", "updatedAt") SELECT "createdAt", "deletedAt", "id", "number", "status", "updatedAt" FROM "restaurantTable";
DROP TABLE "restaurantTable";
ALTER TABLE "new_restaurantTable" RENAME TO "restaurantTable";
CREATE TABLE "new_item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_item" ("createdAt", "deletedAt", "description", "id", "image", "name", "price", "updatedAt") SELECT "createdAt", "deletedAt", "description", "id", "image", "name", "price", "updatedAt" FROM "item";
DROP TABLE "item";
ALTER TABLE "new_item" RENAME TO "item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
