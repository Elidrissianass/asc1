-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `webhoohUrl` VARCHAR(191) NOT NULL,
    `ankorClientID` VARCHAR(191) NOT NULL,
    `ankorClientSecret` VARCHAR(191) NOT NULL,
    `dailyProductSync` BOOLEAN NOT NULL DEFAULT false,
    `pricesDiscountPercentage` INTEGER NOT NULL DEFAULT 0,
    `orderSync` BOOLEAN NOT NULL DEFAULT true,
    `syncedOrderStatus` VARCHAR(191) NOT NULL,
    `termsAccepted` BOOLEAN NOT NULL DEFAULT false,
    `onboardingCompleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
