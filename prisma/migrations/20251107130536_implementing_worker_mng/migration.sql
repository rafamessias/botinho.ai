-- AlterTable
ALTER TABLE "company_whatsapp_numbers" ADD COLUMN     "wsUrl" TEXT;

-- CreateTable
CREATE TABLE "workers" (
    "id" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "currentLoad" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_assignments" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workers_isActive_idx" ON "workers"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "session_assignments_sessionId_key" ON "session_assignments"("sessionId");

-- CreateIndex
CREATE INDEX "session_assignments_sessionId_idx" ON "session_assignments"("sessionId");

-- CreateIndex
CREATE INDEX "session_assignments_workerId_idx" ON "session_assignments"("workerId");

-- CreateIndex
CREATE INDEX "session_assignments_tenantId_idx" ON "session_assignments"("tenantId");

-- AddForeignKey
ALTER TABLE "session_assignments" ADD CONSTRAINT "session_assignments_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
