-- CreateEnum
CREATE TYPE "TypeHash" AS ENUM ('RESET_PASSWORD');

-- CreateTable
CREATE TABLE "Hash" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,
    "type" "TypeHash" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "Hash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hash_user_id_type_key" ON "Hash"("user_id", "type");

-- AddForeignKey
ALTER TABLE "Hash" ADD CONSTRAINT "Hash_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
