/*
  Warnings:

  - You are about to drop the column `onboardingCompleted` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `settings` DROP COLUMN `onboardingCompleted`;

-- CreateTable
CREATE TABLE `OnBoarding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shopId` VARCHAR(191) NOT NULL,
    `currentStep` INTEGER NOT NULL,
    `isOnBoarded` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `OnBoarding_shopId_key`(`shopId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
