-- Enable RLS for all relevant tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "company_member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rdo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "incident" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_owner" ENABLE ROW LEVEL SECURITY;
-- Default deny-all for safety
-- Apply to each table
CREATE POLICY deny_all_user ON "user" FOR ALL TO public USING (false);
CREATE POLICY deny_all_company ON "company" FOR ALL TO public USING (false);
CREATE POLICY deny_all_member ON "company_member" FOR ALL TO public USING (false);
CREATE POLICY deny_all_project ON "project" FOR ALL TO public USING (false);
CREATE POLICY deny_all_rdo ON "rdo" FOR ALL TO public USING (false);
CREATE POLICY deny_all_incident ON "incident" FOR ALL TO public USING (false);
CREATE POLICY deny_all_media ON "media" FOR ALL TO public USING (false);
CREATE POLICY deny_all_comment ON "comment" FOR ALL TO public USING (false);
CREATE POLICY deny_all_project_owner ON "project_owner" FOR ALL TO public USING (false);

-- =======================
-- USER POLICIES
-- =======================

CREATE POLICY user_read_policy ON "user"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "company_member" AS cm1
    JOIN "company_member" AS cm2 ON cm1.company_id = cm2.company_id
    WHERE cm1.user_id = current_setting('app.user_id', true)::text AND cm2.user_id = "user".id
  )
);

CREATE POLICY user_update_policy ON "user"
FOR UPDATE USING (
  id = current_setting('app.user_id', true)::text
);

-- =======================
-- COMPANY POLICIES
-- =======================

CREATE POLICY company_read_update_policy ON "company"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE company_id = "company".id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY company_update_policy ON "company"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE company_id = "company".id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY company_insert_policy ON "company"
FOR INSERT WITH CHECK (true);

-- =======================
-- COMPANY MEMBER POLICIES
-- =======================

CREATE POLICY member_read_policy ON "company_member"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "company_member" AS cm
    WHERE cm.user_id = current_setting('app.user_id', true)::text
      AND cm.company_id = "company_member".company_id
  )
);

CREATE POLICY member_insert_policy ON "company_member"
FOR INSERT WITH CHECK (true);

CREATE POLICY member_update_policy ON "company_member"
FOR UPDATE USING (
  user_id = current_setting('app.user_id', true)::text
);

-- =======================
-- PROJECT POLICIES
-- =======================

CREATE POLICY project_read_policy ON "project"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE user_id = current_setting('app.user_id', true)::text AND company_id = "project".company_id
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE project_id = "project".id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY project_insert_policy ON "project"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE user_id = current_setting('app.user_id', true)::text AND company_id = "project".company_id
  )
);

CREATE POLICY project_update_policy ON "project"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE user_id = current_setting('app.user_id', true)::text AND company_id = "project".company_id
  )
);

-- =======================
-- RDO POLICIES
-- =======================

CREATE POLICY rdo_read_policy ON "rdo"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "rdo".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE project_id = "rdo".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY rdo_insert_policy ON "rdo"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "rdo".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY rdo_update_policy ON "rdo"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "rdo".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
);

-- =======================
-- INCIDENT POLICIES
-- =======================

CREATE POLICY incident_read_policy ON "incident"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "incident".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE project_id = "incident".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY incident_insert_policy ON "incident"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "incident".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY incident_update_policy ON "incident"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "incident".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
);

-- =======================
-- MEDIA POLICIES
-- =======================

CREATE POLICY media_read_policy ON "media"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "media".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE project_id = "media".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY media_insert_policy ON "media"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE company_id = "media".company_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY media_update_policy ON "media"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE company_id = "media".company_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY media_delete_policy ON "media"
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "company_member"
    WHERE company_id = "media".company_id AND user_id = current_setting('app.user_id', true)::text
  )
);

-- =======================
-- COMMENT POLICIES
-- =======================

CREATE POLICY comment_read_policy ON "comment"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "comment".project_id AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE project_id = "comment".project_id AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY comment_insert_policy ON "comment"
FOR INSERT WITH CHECK (
  current_setting('app.user_id', true)::text IS NOT NULL
);

CREATE POLICY comment_update_policy ON "comment"
FOR UPDATE USING (
  current_setting('app.user_id', true)::text IS NOT NULL
);

-- =======================
-- PROJECT OWNER POLICIES
-- =======================

CREATE POLICY project_owner_read_policy ON "project_owner"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "project_owner".project_id 
    AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE id = "project_owner".id 
    AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY project_owner_insert_policy ON "project_owner"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "project_owner".project_id 
    AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY project_owner_update_policy ON "project_owner"
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "project_owner".project_id 
    AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
  OR EXISTS (
    SELECT 1 FROM "project_owner"
    WHERE id = "project_owner".id 
    AND user_id = current_setting('app.user_id', true)::text
  )
);

CREATE POLICY project_owner_delete_policy ON "project_owner"
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM "project"
    JOIN "company_member" ON "project".company_id = "company_member".company_id
    WHERE "project".id = "project_owner".project_id 
    AND "company_member".user_id = current_setting('app.user_id', true)::text
  )
); 