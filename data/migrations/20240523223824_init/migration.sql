-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `lastPublishedAt` DATETIME(3) NULL,
    `archivedAt` DATETIME(3) NULL,

    INDEX `Document_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    INDEX `Person_fullName_idx`(`fullName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonMetadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `personId` INTEGER NOT NULL,

    UNIQUE INDEX `PersonMetadata_personId_key`(`personId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DocumentToPerson` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DocumentToPerson_AB_unique`(`A`, `B`),
    INDEX `_DocumentToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonMetadata` ADD CONSTRAINT `PersonMetadata_personId_fkey` FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DocumentToPerson` ADD CONSTRAINT `_DocumentToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `Document`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DocumentToPerson` ADD CONSTRAINT `_DocumentToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
