/*
  Warnings:

  - A unique constraint covering the columns `[shopId]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopId` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `settings` ADD COLUMN `isOnBoarded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shopId` VARCHAR(191) NOT NULL,
    MODIFY `pricesDiscountPercentage` INTEGER NOT NULL DEFAULT 10,
    MODIFY `syncedOrderStatus` VARCHAR(191) NOT NULL DEFAULT 'authorized';

-- CreateIndex
CREATE UNIQUE INDEX `Settings_shopId_key` ON `Settings`(`shopId`);
