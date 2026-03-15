-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "useQueue" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
