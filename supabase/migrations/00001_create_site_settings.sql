CREATE TABLE site_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value_zh    TEXT,
  value_en    TEXT,
  value_km    TEXT,
  type        TEXT NOT NULL DEFAULT 'text'
                CHECK (type IN ('text', 'image', 'json', 'number')),
  group_name  TEXT NOT NULL DEFAULT 'general'
                CHECK (group_name IN ('brand', 'contact', 'seo', 'theme', 'about', 'social', 'general')),
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_settings_group ON site_settings(group_name);
CREATE INDEX idx_site_settings_key ON site_settings(key);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_site_settings_updated
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
