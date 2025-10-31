-- CreateEnum
CREATE TYPE "public"."KnowledgeItemType" AS ENUM ('TEXT', 'URL');

-- CreateEnum
CREATE TYPE "public"."AiTemplateCategory" AS ENUM ('greeting', 'orders', 'products', 'support', 'closing');

-- CreateTable
CREATE TABLE "public"."knowledge_items" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "type" "public"."KnowledgeItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "knowledge_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quick_answers" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "quick_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_templates" (
    "id" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "public"."AiTemplateCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "ai_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_template_options" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_template_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "knowledge_items_companyId_idx" ON "public"."knowledge_items"("companyId");

-- CreateIndex
CREATE INDEX "knowledge_items_createdAt_idx" ON "public"."knowledge_items"("createdAt");

-- CreateIndex
CREATE INDEX "quick_answers_companyId_idx" ON "public"."quick_answers"("companyId");

-- CreateIndex
CREATE INDEX "quick_answers_createdAt_idx" ON "public"."quick_answers"("createdAt");

-- CreateIndex
CREATE INDEX "ai_templates_companyId_idx" ON "public"."ai_templates"("companyId");

-- CreateIndex
CREATE INDEX "ai_templates_createdAt_idx" ON "public"."ai_templates"("createdAt");

-- CreateIndex
CREATE INDEX "ai_template_options_templateId_idx" ON "public"."ai_template_options"("templateId");

-- AddForeignKey
ALTER TABLE "public"."knowledge_items" ADD CONSTRAINT "knowledge_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."knowledge_items" ADD CONSTRAINT "knowledge_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quick_answers" ADD CONSTRAINT "quick_answers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quick_answers" ADD CONSTRAINT "quick_answers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_templates" ADD CONSTRAINT "ai_templates_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_templates" ADD CONSTRAINT "ai_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_template_options" ADD CONSTRAINT "ai_template_options_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."ai_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
