-- AlterTable
ALTER TABLE "session_assignments" ADD COLUMN     "remoteAuthKey" TEXT,
ADD COLUMN     "remoteAuthNamespace" TEXT;

-- CreateIndex
CREATE INDEX "session_assignments_remoteAuthKey_idx" ON "session_assignments"("remoteAuthKey");
