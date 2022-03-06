-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "auth_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_number" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phone_number.account_id_unique" ON "phone_number"("account_id");

-- AddForeignKey
ALTER TABLE "phone_number" ADD FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
