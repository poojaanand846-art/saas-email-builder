ALTER TABLE sequences ADD COLUMN template_id TEXT;

ALTER TABLE workspaces ADD COLUMN plan TEXT DEFAULT 'free';

CREATE TABLE user_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_templates_select" ON user_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_templates_insert" ON user_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_templates_update" ON user_templates FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_templates_delete" ON user_templates FOR DELETE USING (auth.uid() = user_id);
