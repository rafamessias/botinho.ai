-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "defaultTeamId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_defaultTeamId_fkey" FOREIGN KEY ("defaultTeamId") REFERENCES "public"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
