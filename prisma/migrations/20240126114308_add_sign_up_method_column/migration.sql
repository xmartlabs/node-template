-- CreateEnum
CREATE TYPE "SignUpMethod" AS ENUM ('PASSWORD', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sign_up_method" "SignUpMethod" NOT NULL DEFAULT 'PASSWORD';
