/*
  Warnings:

  - You are about to drop the column `key` on the `staffs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "staffs_key_key";

-- AlterTable
ALTER TABLE "staffs" DROP COLUMN "key";
