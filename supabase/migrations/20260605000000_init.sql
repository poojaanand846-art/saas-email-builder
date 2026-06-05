-- Users are managed by Supabase Auth, no separate table needed

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  primary_color TEXT DEFAULT '#6366f1',
  logo_url TEXT,
  product_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tone TEXT DEFAULT 'professional',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_offset INTEGER NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  body_html TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE esp_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  encrypted_api_key TEXT NOT NULL,
  connected_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT DEFAULT 'html',
  exported_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on every table
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE esp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies — explicit per-operation for defense-in-depth
-- Workspaces
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workspaces_insert" ON workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workspaces_update" ON workspaces FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workspaces_delete" ON workspaces FOR DELETE USING (auth.uid() = user_id);

-- Sequences
CREATE POLICY "sequences_select" ON sequences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sequences_insert" ON sequences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sequences_update" ON sequences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sequences_delete" ON sequences FOR DELETE USING (auth.uid() = user_id);

-- Emails
CREATE POLICY "emails_select" ON emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "emails_insert" ON emails FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "emails_update" ON emails FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "emails_delete" ON emails FOR DELETE USING (auth.uid() = user_id);

-- ESP Connections
CREATE POLICY "esp_select" ON esp_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "esp_insert" ON esp_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "esp_update" ON esp_connections FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "esp_delete" ON esp_connections FOR DELETE USING (auth.uid() = user_id);

-- Exports
CREATE POLICY "exports_select" ON exports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "exports_insert" ON exports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "audit_select" ON audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
