-- Enable RLS for all relevant tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RDO" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Incident" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

-- Default deny-all for safety
-- Apply to each table
CREATE POLICY deny_all_user ON "User" FOR ALL TO public USING (false);
CREATE POLICY deny_all_company ON "Company" FOR ALL TO public USING (false);
CREATE POLICY deny_all_member ON "CompanyMember" FOR ALL TO public USING (false);
CREATE POLICY deny_all_project ON "Project" FOR ALL TO public USING (false);
CREATE POLICY deny_all_rdo ON "RDO" FOR ALL TO public USING (false);
CREATE POLICY deny_all_incident ON "Incident" FOR ALL TO public USING (false);
CREATE POLICY deny_all_media ON "Media" FOR ALL TO public USING (false);
CREATE POLICY deny_all_comment ON "Comment" FOR ALL TO public USING (false);


-- =======================
-- USER POLICIES
-- =======================

CREATE POLICY user_read_policy ON "User"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "CompanyMember" AS cm1
    JOIN "CompanyMember" AS cm2 ON cm1.company_id = cm2.company_id
    WHERE cm1.user_id = current_setting('app.user_id', true)::text AND cm2.user_id = "User".id
  )
);

CREATE POLICY user_update_policy ON "User"
FOR UPDATE USING (
  id = current_setting('app.user_id', true)::text
);

-- =======================
-- COMPANY POLICIES
-- =======================

CREATE POLICY company_read_update_policy ON "Company"
FOR SELECT, UPDATE USING (
  EXISTS (
    SELECT 1 FROM "CompanyMember"
    WHERE company_id = "Company".id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY company_insert_policy ON "Company"
FOR INSERT WITH CHECK (true);

-- =======================
-- COMPANY MEMBER POLICIES
-- =======================

CREATE POLICY member_read_policy ON "CompanyMember"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "CompanyMember" AS cm
    WHERE cm.user_id = current_setting('app.user_id', true)::text
      AND cm.company_id = "CompanyMember".company_id
  )
);

CREATE POLICY member_insert_policy ON "CompanyMember"
FOR INSERT WITH CHECK (true);

CREATE POLICY member_update_policy ON "CompanyMember"
FOR UPDATE USING (
  user_id = current_setting('app.user_id', true)::text
);

-- =======================
-- PROJECT POLICIES
-- =======================

CREATE POLICY project_read_policy ON "Project"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "CompanyMember"
    WHERE user_id = current_setting('app.user_id', true)::text AND company_id = "Project".company_id
  )
  OR EXISTS (
    SELECT 1 FROM "ProjectOwner"
    WHERE project_id = "Project".id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY project_write_policy ON "Project"
FOR INSERT, UPDATE USING (
  EXISTS (
    SELECT 1 FROM "CompanyMember"
    WHERE user_id = current_setting('app.user_id', true)::text AND company_id = "Project".company_id
  )
);

-- =======================
-- RDO POLICIES
-- =======================

CREATE POLICY rdo_read_policy ON "RDO"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Project"
    JOIN "CompanyMember" ON "Project".company_id = "CompanyMember".company_id
    WHERE "Project".id = "RDO".project_id AND "CompanyMember".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "ProjectOwner"
    WHERE project_id = "RDO".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY rdo_write_policy ON "RDO"
FOR INSERT, UPDATE USING (
  EXISTS (
    SELECT 1 FROM "Project"
    JOIN "CompanyMember" ON "Project".company_id = "CompanyMember".company_id
    WHERE "Project".id = "RDO".project_id AND "CompanyMember".user_id = current_setting('app.user_id', true)::text
  )
);

-- =======================
-- INCIDENT POLICIES
-- =======================

CREATE POLICY incident_read_policy ON "Incident"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Project"
    JOIN "CompanyMember" ON "Project".company_id = "CompanyMember".company_id
    WHERE "Project".id = "Incident".project_id AND "CompanyMember".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "ProjectOwner"
    WHERE project_id = "Incident".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY incident_write_policy ON "Incident"
FOR INSERT, UPDATE USING (
  EXISTS (
    SELECT 1 FROM "Project"
    JOIN "CompanyMember" ON "Project".company_id = "CompanyMember".company_id
    WHERE "Project".id = "Incident".project_id AND "CompanyMember".user_id = current_setting('app.user_id', true)::text
  )
);

-- =======================
-- MEDIA POLICIES
-- =======================

CREATE POLICY media_read_policy ON "Media"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Project"
    JOIN "CompanyMember" ON "Project".company_id = "CompanyMember".company_id
    WHERE "Project".id = "Media".project_id AND "CompanyMember".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "ProjectOwner"
    WHERE project_id = "Media".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY media_crud_policy ON "Media"
FOR INSERT, UPDATE, DELETE USING (
  EXISTS (
    SELECT 1 FROM "CompanyMember"
    WHERE company_id = "Media".company_id AND user_id = current_setting('app.user_id', true)::text
  )
);

-- =======================
-- COMMENT POLICIES
-- =======================

CREATE POLICY comment_read_policy ON "Comment"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "Project"
    JOIN "CompanyMember" ON "Project".company_id = "CompanyMember".company_id
    WHERE "Project".id = "Comment".project_id AND "CompanyMember".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "ProjectOwner"
    WHERE project_id = "Comment".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY comment_write_policy ON "Comment"
FOR INSERT, UPDATE USING (
  current_setting('app.user_id', true)::text IS NOT NULL
);
