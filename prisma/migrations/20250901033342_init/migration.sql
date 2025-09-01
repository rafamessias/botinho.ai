-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "idProvider" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3);
