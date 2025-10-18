-- AlterTable
ALTER TABLE "surveys" ADD COLUMN     "publicToken" TEXT;

-- CreateIndex
CREATE INDEX "surveys_publicToken_idx" ON "surveys"("publicToken");
