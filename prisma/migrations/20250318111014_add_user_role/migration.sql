-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'HOSTEL_OWNER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';
