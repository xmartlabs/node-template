-- CreateEnum
CREATE TYPE "TypeHash" AS ENUM ('RESET_PASSWORD', 'UPDATE_EMAIL', 'UPDATE_PHONE', 'VALIDATE_EMAIL', 'VALIDATE_PHONE');

-- CreateTable
CREATE TABLE "hashes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "sent_to" TEXT NOT NULL,
    "type" "TypeHash" NOT NULL,
    "hash" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "hashes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hashes_sent_to_type_key" ON "hashes"("sent_to", "type");

-- AddForeignKey
ALTER TABLE "hashes" ADD CONSTRAINT "hashes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
